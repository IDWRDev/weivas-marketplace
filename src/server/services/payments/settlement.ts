import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/server/db/client";
import { verifyPaystackTransaction } from "./paystack";

export async function confirmPaystackPayment(reference: string, event?: { key: string; type: string; rawBody: string }) {
  const verified = await verifyPaystackTransaction(reference);
  if (verified.reference !== reference || verified.status !== "success") throw new Error("Paystack has not verified this payment as successful.");
  const expected = await db.payment.findUnique({ where: { providerReference: reference } });
  if (!expected) throw new Error("Payment reference does not belong to an order.");
  if (verified.amount !== expected.amountMinor || verified.currency !== expected.currency) {
    await db.payment.update({ where: { id: expected.id }, data: { status: "manual_review", providerStatus: verified.status, failureReason: "Verified amount or currency did not match the order." } });
    throw new Error("Verified payment totals do not match the order.");
  }

  return db.$transaction(async (tx) => {
    if (event) {
      const prior = await tx.paymentWebhookEvent.findUnique({ where: { eventKey: event.key } });
      if (prior?.processedAt) return tx.payment.findUnique({ where: { providerReference: reference }, include: { order: true } });
      await tx.paymentWebhookEvent.upsert({
        where: { eventKey: event.key },
        create: { provider: "paystack", eventKey: event.key, eventType: event.type, payloadHash: createHash("sha256").update(event.rawBody).digest("hex") },
        update: {},
      });
    }

    const payment = await tx.payment.findUnique({ where: { providerReference: reference }, include: { order: true } });
    if (!payment) throw new Error("Payment reference does not belong to an order.");
    if (payment.status === "succeeded") {
      if (event) await tx.paymentWebhookEvent.update({ where: { eventKey: event.key }, data: { processedAt: new Date() } });
      return payment;
    }
    if (payment.order.status !== "pending_payment") throw new Error("This order can no longer accept payment.");

    const paidAt = verified.paid_at ? new Date(verified.paid_at) : new Date();
    await tx.payment.update({ where: { id: payment.id }, data: { status: "succeeded", providerStatus: verified.status, providerTransactionId: String(verified.id), paidAt, failureReason: null } });
    await tx.order.update({ where: { id: payment.orderId }, data: { status: "paid" } });
    await tx.sellerOrder.updateMany({ where: { orderId: payment.orderId, status: "pending_payment" }, data: { status: "paid" } });
    if (event) await tx.paymentWebhookEvent.update({ where: { eventKey: event.key }, data: { processedAt: new Date() } });
    return { ...payment, status: "succeeded" as const, paidAt };
  });
}
