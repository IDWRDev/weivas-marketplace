import { NextResponse } from "next/server";
import { z } from "zod";
import { requireArea } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { createProductImageUpload } from "@/server/storage/r2";

const schema = z.object({ productId: z.string().min(1), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]) });

export async function POST(request: Request) {
  const session = await requireArea("seller");
  const input = schema.parse(await request.json());
  const product = await db.product.findFirst({ where: { id: input.productId, sellerProfile: { userId: session.user.id } }, select: { id: true } });
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json(await createProductImageUpload(product.id, input.contentType));
}
