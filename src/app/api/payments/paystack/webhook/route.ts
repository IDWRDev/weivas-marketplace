import { NextResponse } from "next/server";
import { getServerEnv } from "@/server/env";
import { confirmPaystackPayment } from "@/server/services/payments/settlement";
import { verifyPaystackSignature } from "@/server/services/payments/signature";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const env = getServerEnv();
  if (env.PAYMENT_PROVIDER !== "paystack" || !env.PAYMENT_SECRET_KEY) return NextResponse.json({ error: "Payment provider is not active." }, { status: 503 });
  if (!verifyPaystackSignature(rawBody, request.headers.get("x-paystack-signature"), env.PAYMENT_SECRET_KEY)) return NextResponse.json({ error: "Invalid signature." }, { status: 401 });

  const payload = JSON.parse(rawBody) as { event?: string; data?: { id?: number; reference?: string } };
  if (payload.event !== "charge.success" || !payload.data?.reference) return NextResponse.json({ received: true });
  const eventKey = `charge.success:${payload.data.id ?? payload.data.reference}`;
  await confirmPaystackPayment(payload.data.reference, { key: eventKey, type: payload.event, rawBody });
  return NextResponse.json({ received: true });
}
