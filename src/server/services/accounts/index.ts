import "server-only";
import { db } from "@/server/db/client";

export const getBuyerDashboardData = (userId: string) =>
  db.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      buyerProfile: true,
      addresses: { orderBy: [{ isDefaultShipping: "desc" }, { createdAt: "asc" }] },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { sellerOrders: { include: { store: true, items: { take: 2 } } } },
      },
      wishlist: { include: { items: { take: 5, include: { product: { include: { store: true } } } } } },
      recentlyViewed: { orderBy: { viewedAt: "desc" }, take: 5, include: { product: true } },
    },
  });

export const getBuyerOrders = (userId: string, filters?: { query?: string; status?: string }) =>
  db.order.findMany({
    where: {
      buyerId: userId,
      ...(filters?.status ? { status: filters.status as never } : {}),
      ...(filters?.query ? { orderNumber: { contains: filters.query, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { sellerOrders: { include: { store: true, items: { take: 2 } } } },
  });

export const getBuyerOrder = (userId: string, orderId: string) =>
  db.order.findFirst({
    where: { id: orderId, buyerId: userId },
    include: { sellerOrders: { include: { store: true, items: true } }, addresses: true },
  });

export const getActiveBuyerOrders = (userId: string) =>
  db.order.findMany({
    where: { buyerId: userId, status: { notIn: ["completed", "cancelled", "refunded"] } },
    orderBy: { createdAt: "desc" },
    include: { sellerOrders: { include: { store: true, items: { take: 1 } } } },
  });
