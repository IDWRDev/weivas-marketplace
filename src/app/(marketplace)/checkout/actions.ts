"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireArea } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { getServerEnv } from "@/server/env";
import { createOrderDraft } from "@/server/services/orders/draft";
import { initializePaystackTransaction } from "@/server/services/payments/paystack";

const checkoutSchema = z.object({
  addressId: z.string().min(1),
  checkoutKey: z.string().uuid(),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive().max(100) })).min(1).max(100),
});

export async function placeOrder(formData: FormData) {
  const session = await requireArea("account", "/checkout");
  const env = getServerEnv();
  if (env.PAYMENT_PROVIDER !== "paystack" || env.SHIPMENT_PROVIDER !== "shipbubble") throw new Error("Online checkout requires both Paystack and Shipbubble to be active.");
  const parsed = checkoutSchema.parse({ addressId: formData.get("addressId"), checkoutKey: formData.get("checkoutKey"), items: JSON.parse(String(formData.get("items") ?? "[]")) });
  if (new Set(parsed.items.map(item => item.productId)).size !== parsed.items.length) throw new Error("Duplicate checkout items are not allowed.");

  let payment = await db.payment.findUnique({ where: { checkoutKey: parsed.checkoutKey }, include: { order: true } });
  if (payment && payment.order.buyerId !== session.user.id) throw new Error("Invalid checkout session.");
  if (payment?.authorizationUrl && ["initialized", "pending"].includes(payment.status)) redirect(payment.authorizationUrl);

  if (!payment) {
    const [address, products] = await Promise.all([
      db.address.findFirst({ where: { id: parsed.addressId, userId: session.user.id } }),
      db.product.findMany({ where: { id: { in: parsed.items.map(item => item.productId) }, status: "active", store: { status: "active" } } }),
    ]);
    if (!address) throw new Error("Choose a valid delivery address.");
    if (products.length !== parsed.items.length) throw new Error("One or more products are no longer available.");
    const quantityByProduct = new Map(parsed.items.map(item => [item.productId, item.quantity]));
    const currencies = new Set(products.map(product => product.currency));
    if (currencies.size !== 1 || !currencies.has(env.MARKETPLACE_CURRENCY)) throw new Error(`Checkout currently supports ${env.MARKETPLACE_CURRENCY} products only.`);
    const lines = products.map(product => ({ productId: product.id, sellerProfileId: product.sellerProfileId, storeId: product.storeId, title: product.title, sku: product.sku, unitPriceMinor: product.priceMinor, quantity: quantityByProduct.get(product.id)!, stock: product.stock, available: product.stock > 0 && product.minimumOrderQuantity <= quantityByProduct.get(product.id)! }));
    const draft = createOrderDraft({ buyerId: session.user.id, currency: env.MARKETPLACE_CURRENCY, addressId: address.id, lines });
    const reference = `WIV-${Date.now()}-${randomBytes(5).toString("hex")}`;

    payment = await db.$transaction(async tx => {
      for (const line of lines) {
        const reserved = await tx.product.updateMany({ where: { id: line.productId, status: "active", stock: { gte: line.quantity } }, data: { stock: { decrement: line.quantity } } });
        if (reserved.count !== 1) throw new Error(`${line.title} no longer has enough stock.`);
      }
      const order = await tx.order.create({ data: {
        orderNumber: reference, buyerId: draft.buyerId, currency: draft.currency,
        subtotalMinor: draft.subtotalMinor, discountMinor: 0, shippingMinor: 0, taxMinor: 0, totalMinor: draft.totalMinor, status: "pending_payment",
        addresses: { create: { type: "shipping", firstName: address.firstName, lastName: address.lastName, phone: address.phone, line1: address.line1, line2: address.line2, city: address.city, stateRegion: address.stateRegion, postalCode: address.postalCode, countryCode: address.countryCode } },
        sellerOrders: { create: draft.sellerOrders.map(sellerOrder => ({ sellerProfileId: sellerOrder.sellerProfileId, storeId: sellerOrder.storeId, subtotalMinor: sellerOrder.subtotalMinor, shippingMinor: 0, taxMinor: 0, totalMinor: sellerOrder.subtotalMinor, status: "pending_payment", items: { create: sellerOrder.items } })) },
        payment: { create: { checkoutKey: parsed.checkoutKey, provider: "paystack", providerReference: reference, amountMinor: draft.totalMinor, currency: draft.currency, status: "initialized" } },
      }, include: { payment: true } });
      return { ...order.payment!, order };
    });
  }

  try {
    const initialized = await initializePaystackTransaction({ email: session.user.email, amountMinor: payment.amountMinor, currency: payment.currency, reference: payment.providerReference, callbackUrl: `${env.NEXT_PUBLIC_APP_URL}/checkout/complete?reference=${encodeURIComponent(payment.providerReference)}`, metadata: { orderId: payment.orderId, orderNumber: payment.order.orderNumber } });
    await db.payment.update({ where: { id: payment.id }, data: { authorizationUrl: initialized.authorization_url, accessCode: initialized.access_code, status: "pending", providerStatus: "initialized" } });
    redirect(initialized.authorization_url);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    await db.$transaction(async tx => {
      const failed = await tx.payment.updateMany({ where: { id: payment.id, status: { in: ["initialized", "pending"] } }, data: { status: "failed", failureReason: error instanceof Error ? error.message : "Payment initialization failed." } });
      if (failed.count !== 1) return;
      const order = await tx.order.findUniqueOrThrow({ where: { id: payment.orderId }, include: { sellerOrders: { include: { items: true } } } });
      await tx.order.update({ where: { id: order.id }, data: { status: "cancelled" } });
      await tx.sellerOrder.updateMany({ where: { orderId: order.id }, data: { status: "cancelled" } });
      for (const item of order.sellerOrders.flatMap(sellerOrder => sellerOrder.items)) await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
    });
    throw new Error("Payment could not be started. No charge was made and reserved stock was released.");
  }
}
