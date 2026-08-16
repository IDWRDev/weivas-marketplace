import { createHmac, timingSafeEqual } from "node:crypto";

export function paystackSignature(rawBody: string, secret: string) {
  return createHmac("sha512", secret).update(rawBody).digest("hex");
}

export function verifyPaystackSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = Buffer.from(paystackSignature(rawBody, secret), "utf8");
  const received = Buffer.from(signature, "utf8");
  return expected.length === received.length && timingSafeEqual(expected, received);
}
