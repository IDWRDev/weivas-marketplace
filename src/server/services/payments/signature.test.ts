import { describe, expect, it } from "vitest";
import { paystackSignature, verifyPaystackSignature } from "./signature";

describe("Paystack webhook signatures", () => {
  it("accepts the exact HMAC SHA-512 signature", () => {
    const raw = JSON.stringify({ event: "charge.success", data: { id: 42, reference: "WIV-42" } });
    const signature = paystackSignature(raw, "test-secret");
    expect(verifyPaystackSignature(raw, signature, "test-secret")).toBe(true);
  });

  it("rejects missing, altered, or wrong-secret signatures", () => {
    const raw = JSON.stringify({ event: "charge.success", data: { id: 42 } });
    const signature = paystackSignature(raw, "test-secret");
    expect(verifyPaystackSignature(`${raw} `, signature, "test-secret")).toBe(false);
    expect(verifyPaystackSignature(raw, signature, "wrong-secret")).toBe(false);
    expect(verifyPaystackSignature(raw, null, "test-secret")).toBe(false);
  });
});
