import "server-only";
import { db } from "@/server/db/client";

export async function getApprovedSeller(userId: string) {
  return db.sellerProfile.findFirstOrThrow({
    where: { userId, applicationStatus: "approved" },
    include: { store: true },
  });
}

export const getSellerDashboardData = (userId: string) =>
  db.sellerProfile.findFirstOrThrow({
    where: { userId, applicationStatus: "approved" },
    include: {
      store: true,
      products: { include: { category: true }, orderBy: { updatedAt: "desc" } },
      sellerOrders: { orderBy: { createdAt: "desc" }, take: 8, include: { order: true, items: true } },
    },
  });

export async function getSellerOrder(userId: string, orderId: string) {
  const seller = await getApprovedSeller(userId);
  return db.sellerOrder.findFirst({
    where: { id: orderId, sellerProfileId: seller.id },
    include: { order: { include: { addresses: true } }, store: true, items: true },
  });
}

export async function getSellerInventory(userId: string) {
  const seller = await getApprovedSeller(userId);
  return db.product.findMany({
    where: { sellerProfileId: seller.id, status: { not: "archived" } },
    include: { category: true, variants: true },
    orderBy: [{ stock: "asc" }, { title: "asc" }],
  });
}
