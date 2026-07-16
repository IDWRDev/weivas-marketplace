import Link from "next/link";
import { PackageCheck, Truck } from "lucide-react";
import { Card, Badge } from "@/components/ui/Primitives";
import { requireArea } from "@/server/auth/session";
import { getActiveBuyerOrders } from "@/server/services/accounts";

export default async function TrackingPage() {
  const session = await requireArea("account");
  const orders = await getActiveBuyerOrders(session.user.id);
  return <><header className="dash-head"><div><small>ACTIVE DELIVERIES</small><h1>Order tracking</h1><p>Follow active seller shipments from confirmation to delivery.</p></div><Truck aria-hidden="true" /></header><div className="account-stack">{orders.length ? orders.map(order => <Card className="tracking-card" key={order.id}><div className="panel-heading"><div><b>{order.orderNumber}</b><small>{order.sellerOrders.length} seller shipment(s)</small></div><Badge tone="orange">{order.status.replaceAll("_", " ")}</Badge></div><ol className="shipment-steps" aria-label={`Tracking status for ${order.orderNumber}`}>{["Confirmed", "Packed", "Shipped", "In transit", "Delivered"].map((step,index)=><li className={index===0?"current":""} key={step}><PackageCheck aria-hidden="true"/><span>{step}</span></li>)}</ol><Link className="button secondary" href={`/account/orders/${order.id}`}>View order details</Link></Card>) : <Card className="premium-empty"><PackageCheck aria-hidden="true"/><h2>No active deliveries</h2><p>Orders being prepared or shipped will appear here with their latest status.</p><Link className="button" href="/">Explore marketplace</Link></Card>}</div></>;
}
