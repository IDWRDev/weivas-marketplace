import { notFound } from "next/navigation";
import { Badge, Card } from "@/components/ui/Primitives";
import { requireArea } from "@/server/auth/session";
import { getSellerOrder } from "@/server/services/sellers";
import { transitionSellerOrder } from "../actions";

const money = (minor: number, currency: string) => new Intl.NumberFormat("en", { style: "currency", currency }).format(minor / 100);

export default async function SellerOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const session = await requireArea("seller");
  const { orderId } = await params;
  const sellerOrder = await getSellerOrder(session.user.id, orderId);
  if (!sellerOrder) notFound();
  const address = sellerOrder.order.addresses.find(item => item.type === "shipping");
  const nextStatuses: Record<string, string[]> = { paid:["processing"],processing:["packed"],packed:["ready_for_pickup","shipped"],ready_for_pickup:["shipped"],shipped:["in_transit"],in_transit:["delivered"],delivered:["completed"] };
  return <><header className="dash-head"><div><small>SELLER ORDER</small><h1>{sellerOrder.order.orderNumber}</h1><p>Created {sellerOrder.createdAt.toLocaleDateString()} · {sellerOrder.store.name}</p></div><Badge tone="orange">{sellerOrder.status.replaceAll("_"," ")}</Badge></header><div className="dash-grid"><Card className="span2"><h2>Order items</h2>{sellerOrder.items.map(item=><article className="order" key={item.id}><span>{item.quantity}×</span><div><b>{item.productTitleSnapshot}</b><small>{item.skuSnapshot} · {money(item.unitPriceMinor,sellerOrder.order.currency)} each</small></div><strong>{money(item.lineTotalMinor,sellerOrder.order.currency)}</strong></article>)}</Card><Card className="dark-card"><small>ORDER TOTAL</small><h2>{money(sellerOrder.totalMinor,sellerOrder.order.currency)}</h2><p>Payment provider status: {sellerOrder.order.status.replaceAll("_"," ")}</p></Card><Card><h2>Fulfilment address</h2>{address?<address>{address.firstName} {address.lastName}<br/>{address.line1}<br/>{address.city}, {address.stateRegion} {address.postalCode}<br/>{address.countryCode}<br/>{address.phone}</address>:<p>No shipping address snapshot.</p>}</Card><Card><h2>Allowed actions</h2><div className="action-stack">{(nextStatuses[sellerOrder.status]??[]).map(status=><form action={transitionSellerOrder} key={status}><input type="hidden" name="id" value={sellerOrder.id}/><input type="hidden" name="status" value={status}/><button className="button">Mark {status.replaceAll("_"," ")}</button></form>)}<button className="button secondary" disabled>Add tracking — provider pending</button><button className="button secondary" disabled>Contact buyer — messaging pending</button></div></Card></div></>;
}
