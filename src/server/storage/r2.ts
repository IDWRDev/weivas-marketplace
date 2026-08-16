import "server-only";
import { randomUUID } from "node:crypto";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerEnv } from "@/server/env";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

function configuredClient() {
  const env = getServerEnv();
  if (env.STORAGE_PROVIDER !== "s3-compatible" || !env.STORAGE_ENDPOINT || !env.STORAGE_BUCKET || !env.STORAGE_ACCESS_KEY || !env.STORAGE_SECRET_KEY || !env.STORAGE_PUBLIC_URL) throw new Error("Cloudflare R2 is not configured.");
  return { env, client: new S3Client({ region: "auto", endpoint: env.STORAGE_ENDPOINT, credentials: { accessKeyId: env.STORAGE_ACCESS_KEY, secretAccessKey: env.STORAGE_SECRET_KEY } }) };
}

export async function createProductImageUpload(productId: string, contentType: string) {
  const { env, client } = configuredClient();
  if (!allowedTypes.has(contentType)) throw new Error("Only JPEG, PNG, and WebP product images are allowed.");
  const key = `products/${productId}/${randomUUID()}.${extensions[contentType]}`;
  const uploadUrl = await getSignedUrl(client, new PutObjectCommand({ Bucket: env.STORAGE_BUCKET, Key: key, ContentType: contentType }), { expiresIn: 300 });
  return { uploadUrl, publicUrl: `${env.STORAGE_PUBLIC_URL!.replace(/\/$/, "")}/${key}`, key, expiresInSeconds: 300 };
}

export async function verifyProductImageUpload(productId: string, key: string) {
  if (!key.startsWith(`products/${productId}/`) || key.includes("..")) throw new Error("Invalid product image key.");
  const { env, client } = configuredClient();
  const object = await client.send(new HeadObjectCommand({ Bucket: env.STORAGE_BUCKET, Key: key }));
  if (!object.ContentType || !allowedTypes.has(object.ContentType)) throw new Error("Uploaded product image type is not allowed.");
  if (!object.ContentLength || object.ContentLength > 10 * 1024 * 1024) throw new Error("Product images must be no larger than 10 MB.");
  return `${env.STORAGE_PUBLIC_URL!.replace(/\/$/, "")}/${key}`;
}
