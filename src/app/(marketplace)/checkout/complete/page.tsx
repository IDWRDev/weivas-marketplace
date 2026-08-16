import Link from "next/link";
import { requireArea } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { confirmPaystackPayment } from "@/server/services/payments/settlement";

export const dynamic = "force-dynamic";

export default async function PaymentCompletePage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const session = await requireArea("account", "/checkout/complete");
  const reference = (await searchParams).reference ?? "";
  const payment = reference ? await db.payment.findFirst({ where: { providerReference: reference, order: { buyerId: session.user.id } }, include: { order: true } }) : null;
  if (!payment) return <main className="commerce-page checkout-page"><section className="empty-state"><h1>Payment reference not found</h1><p>No order belonging to your account matches this payment reference.</p><Link className="button" href="/account/orders">View your orders</Link></section></main>;

  let confirmed = payment.status === "succeeded";
  if (!confirmed && ["initialized", "pending"].includes(payment.status)) {
    try { await confirmPaystackPayment(reference); confirmed = true; } catch { confirmed = false; }
  }
  return <main className="commerce-page checkout-page"><section className="empty-state"><h1>{confirmed ? "Payment confirmed" : "Payment is still being confirmed"}</h1><p>{confirmed ? `Order ${payment.order.orderNumber} has been paid and sent to the seller for processing.` : "Your order remains unpaid. We will update it only after Paystack verifies the transaction."}</p><Link className="button" href={`/account/orders/${payment.orderId}`}>View order</Link></section></main>;
}
