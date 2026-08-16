import "server-only";
import { getServerEnv } from "@/server/env";

const endpoint = "https://api.paystack.co";

type PaystackEnvelope<T> = { status: boolean; message: string; data: T };
export type VerifiedPaystackTransaction = {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
  gateway_response?: string;
};

async function request<T>(path: string, init?: RequestInit) {
  const secret = getServerEnv().PAYMENT_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured.");
  const response = await fetch(`${endpoint}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const payload = (await response.json()) as PaystackEnvelope<T>;
  if (!response.ok || !payload.status) throw new Error(payload.message || `Paystack request failed (${response.status}).`);
  return payload.data;
}

export function initializePaystackTransaction(input: { email: string; amountMinor: number; currency: string; reference: string; callbackUrl: string; metadata: Record<string, unknown> }) {
  return request<{ authorization_url: string; access_code: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({ email: input.email, amount: input.amountMinor, currency: input.currency, reference: input.reference, callback_url: input.callbackUrl, metadata: input.metadata }),
  });
}

export function verifyPaystackTransaction(reference: string) {
  return request<VerifiedPaystackTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);
}
