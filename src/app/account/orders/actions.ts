"use server";

import { revalidatePath } from "next/cache";
import { requireArea } from "@/server/auth/session";
import { db } from "@/server/db/client";

export async function cancelPendingOrder(formData: FormData) {
  const session = await requireArea("account");
  const orderId = String(formData.get("orderId") ?? "");

  await db.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: orderId, buyerId: session.user.id },
      include: { sellerOrders: { include: { items: true } } },
    });
    if (!order) throw new Error("Order not found.");
    if (order.status !== "pending_payment") throw new Error("Only unpaid orders can be cancelled online.");

    const changed = await tx.order.updateMany({
      where: { id: order.id, buyerId: session.user.id, status: "pending_payment" },
      data: { status: "cancelled" },
    });
    if (changed.count !== 1) throw new Error("This order can no longer be cancelled.");

    await tx.sellerOrder.updateMany({ where: { orderId: order.id }, data: { status: "cancelled" } });
    for (const item of order.sellerOrders.flatMap((sellerOrder) => sellerOrder.items)) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
      if (item.variantId) {
        await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } });
      }
    }
  });

  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${orderId}`);
}
