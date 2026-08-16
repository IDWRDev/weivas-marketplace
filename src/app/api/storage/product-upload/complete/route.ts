import { NextResponse } from "next/server";
import { z } from "zod";
import { requireArea } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { verifyProductImageUpload } from "@/server/storage/r2";

const schema = z.object({ productId: z.string().min(1), key: z.string().min(1), altText: z.string().trim().min(3).max(160) });

export async function POST(request: Request) {
  const session = await requireArea("seller");
  const input = schema.parse(await request.json());
  const product = await db.product.findFirst({ where: { id: input.productId, sellerProfile: { userId: session.user.id } }, select: { id: true, images: { select: { id: true } } } });
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const url = await verifyProductImageUpload(product.id, input.key);
  const image = await db.productImage.create({ data: { productId: product.id, url, altText: input.altText, sortOrder: product.images.length, isPrimary: product.images.length === 0 } });
  return NextResponse.json({ image: { id: image.id, url: image.url, altText: image.altText, isPrimary: image.isPrimary } });
}
