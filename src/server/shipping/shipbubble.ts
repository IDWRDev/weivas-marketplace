import "server-only";
import { getServerEnv } from "@/server/env";

const endpoint = "https://api.shipbubble.com/v1";

async function shipbubble<T>(path: string, body: unknown) {
  const env = getServerEnv();
  if (env.SHIPMENT_PROVIDER !== "shipbubble" || !env.SHIPBUBBLE_API_KEY) throw new Error("Shipbubble is not configured.");
  const response = await fetch(`${endpoint}${path}`, { method: "POST", headers: { Authorization: `Bearer ${env.SHIPBUBBLE_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
  const payload = await response.json() as { status: string; message?: string; data: T };
  if (!response.ok || payload.status !== "success") throw new Error(payload.message || `Shipbubble request failed (${response.status}).`);
  return payload.data;
}

export type ShipbubbleRate = { courier_id: string | number; courier_name: string; service_code: string; service_type: string; delivery_eta: string; currency: string; rate_card_amount: number; total: number; tracking_level: number };
export function fetchShipbubbleRates(input: { senderAddressCode: number; receiverAddressCode: number; pickupDate: string; categoryId: number; packageItems: Array<{ name: string; description: string; unit_weight: string; unit_amount: string; quantity: string }>; dimensions: { length: number; width: number; height: number } }) {
  return shipbubble<{ request_token: string; couriers: ShipbubbleRate[]; cheapest_courier?: ShipbubbleRate; fastest_courier?: ShipbubbleRate }>("/shipping/fetch_rates", { sender_address_code: input.senderAddressCode, reciever_address_code: input.receiverAddressCode, pickup_date: input.pickupDate, category_id: input.categoryId, package_items: input.packageItems, package_dimension: input.dimensions });
}
