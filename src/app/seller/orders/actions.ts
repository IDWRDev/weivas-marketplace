"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db/client";
import { requireArea } from "@/server/auth/session";
import { getApprovedSeller } from "@/server/services/sellers";
import { canTransitionSellerOrder, type SellerOrderStatus } from "@/server/services/orders/transitions";

export async function transitionSellerOrder(formData: FormData) {
  const session = await requireArea("seller");
  const seller = await getApprovedSeller(session.user.id);
  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("status") ?? "") as SellerOrderStatus;
  const order = await db.sellerOrder.findFirst({ where: { id, sellerProfileId: seller.id }, select: { status: true } });
  if (!order) throw new Error("Seller order not found.");
  if (!canTransitionSellerOrder(order.status, next)) throw new Error("That order status transition is not allowed.");
  await db.sellerOrder.update({ where: { id, sellerProfileId: seller.id }, data: { status: next } });
  revalidatePath("/seller/orders");
  revalidatePath(`/seller/orders/${id}`);
}
