import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Boxes, PackagePlus, ShoppingBag, Store } from "lucide-react";
import { Badge, Card } from "@/components/ui/Primitives";
import { requireArea } from "@/server/auth/session";
import { getSellerDashboardData } from "@/server/services/sellers";
import { formatCurrency } from "@/lib/marketplace";

export default async function Page(){
  const session=await requireArea("seller");
  const seller=await getSellerDashboardData(session.user.id);
  const revenue=seller.sellerOrders.filter(order=>order.status==="completed").reduce((sum,order)=>sum+order.totalMinor,0);
  const pending=seller.sellerOrders.filter(order=>!["completed","cancelled","refunded"].includes(order.status)).length;
  const lowStock=seller.products.filter(product=>product.stock<=product.lowStockThreshold);
  return <>
    <header className="dash-head seller-command-head"><div><small>SELLER COMMAND CENTRE</small><h1>{seller.store?.name??"Your Weivas store"}</h1><p>Operate your catalogue, fulfilment, inventory and store performance.</p></div><div><Badge tone="green">Approved seller</Badge><Link className="button" href="/seller/products/new"><PackagePlus/>Add product</Link></div></header>
    <nav className="seller-quick-actions" aria-label="Seller quick actions"><Link href="/seller/orders"><ShoppingBag/>Manage orders <ArrowRight/></Link><Link href="/seller/inventory"><Boxes/>Check inventory <ArrowRight/></Link><Link href="/seller/payouts"><BadgeDollarSign/>Review balances <ArrowRight/></Link><Link href="/seller/store"><Store/>Edit storefront <ArrowRight/></Link></nav>
    <div className="metrics five">{[["Completed revenue",formatCurrency(revenue)],["Store orders",seller.sellerOrders.length],["Pending fulfilment",pending],["Catalogue products",seller.products.length],["Low-stock alerts",lowStock.length]].map(([label,value])=><Card key={String(label)}><small>{label}</small><strong>{value}</strong></Card>)}</div>
    <div className="dash-grid seller-grid"><Card className="span2"><div className="panel-heading"><div><h2>Sales operations</h2><small>Derived only from orders belonging to this store</small></div><Link href="/seller/analytics">Open analytics</Link></div>{seller.sellerOrders.length?<p>{seller.sellerOrders.length} recent seller orders are available for operational review.</p>:<div className="seller-empty"><ShoppingBag/><b>No sales yet</b><p>Your dashboard begins at zero. Orders will appear only when buyers purchase your approved products.</p></div>}</Card><Card><h2>Inventory attention</h2>{lowStock.length?lowStock.slice(0,5).map(product=><p key={product.id}><b>{product.title}</b><br/><small>{product.stock} units remaining</small></p>):<p>No low-stock products require attention.</p>}<Link href="/seller/inventory">Open inventory</Link></Card><Card><h2>Recent fulfilment</h2>{seller.sellerOrders.length?seller.sellerOrders.map(order=><p key={order.id}><Link href={`/seller/orders/${order.id}`}>{formatCurrency(order.totalMinor)} · {order.status.replaceAll("_"," ")}</Link></p>):<p>No seller orders yet.</p>}</Card><Card className="dark-card"><small>STORE HEALTH</small><h2>{seller.store?.status?.replaceAll("_"," ")??"Setup pending"}</h2><p>Verification: {seller.verificationStatus.replaceAll("_"," ")}</p><Link className="button" href="/seller/settings">Business settings</Link></Card></div>
  </>;
}
