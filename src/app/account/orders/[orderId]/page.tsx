import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelPendingOrder } from "@/app/account/orders/actions";
import { Card, Badge } from "@/components/ui/Primitives";
import { requireArea } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { formatCurrency } from "@/lib/marketplace";

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const session = await requireArea("account");
  const { orderId } = await params;
  const order = await db.order.findFirst({
    where: { id: orderId, buyerId: session.user.id },
    include: { sellerOrders: { include: { store: true, items: true } }, addresses: true },
  });
  if (!order) notFound();
  const canCancel = order.status === "pending_payment";

  return <>
    <header className="dash-head">
      <div><small>ORDER DETAILS</small><h1>{order.orderNumber}</h1><p>Created {order.createdAt.toLocaleDateString()}</p></div>
      <Badge tone={order.status === "cancelled" ? "red" : "orange"}>{order.status.replaceAll("_", " ")}</Badge>
    </header>
    <div className="dash-grid">
      <Card className="span2"><h2>Seller shipments</h2>{order.sellerOrders.map((sellerOrder) => <section key={sellerOrder.id}><h3>{sellerOrder.store.name}</h3>{sellerOrder.items.map((item) => <div className="order" key={item.id}><span>{item.quantity}×</span><b>{item.productTitleSnapshot}</b><strong>{formatCurrency(item.lineTotalMinor)}</strong></div>)}</section>)}</Card>
      <Card><h2>Order summary</h2><p>Subtotal <b>{formatCurrency(order.subtotalMinor)}</b></p><p>Shipping <b>{formatCurrency(order.shippingMinor)}</b></p><p>Tax <b>{formatCurrency(order.taxMinor)}</b></p><p>Total <strong>{formatCurrency(order.totalMinor)}</strong></p><p>Payment status: {order.status === "pending_payment" ? "awaiting payment provider" : order.status.replaceAll("_", " ")}</p></Card>
      <Card><h2>Order controls</h2><p>Current status: <b>{order.status.replaceAll("_", " ")}</b></p>{canCancel ? <form action={cancelPendingOrder}><input type="hidden" name="orderId" value={order.id}/><button className="button secondary" type="submit">Cancel unpaid order</button></form> : null}<Link className="button secondary" href="/support">Contact support</Link><small>Returns and disputes are reviewed against the seller policy and buyer-protection terms.</small></Card>
    </div>
  </>;
}
