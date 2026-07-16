import Link from "next/link";
import { Building2, CircleAlert, PackageCheck, ShieldCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/Primitives";
import { db } from "@/server/db/client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [activeBuyers, verifiedSellers, liveProducts, protectedOrders, sellerReviews, productReviews, completedOrders, allOrders] = await Promise.all([
    db.user.count({ where: { status: "active", roles: { some: { role: "buyer" } } } }),
    db.sellerProfile.count({ where: { applicationStatus: "approved", verificationStatus: "verified" } }),
    db.product.count({ where: { status: "active" } }),
    db.order.count(),
    db.sellerProfile.count({ where: { applicationStatus: { in: ["submitted", "under_review"] } } }),
    db.product.count({ where: { status: { in: ["submitted", "under_review"] } } }),
    db.order.count({ where: { status: "completed" } }),
    db.order.count(),
  ]);
  const completionRate=allOrders?`${((completedOrders/allOrders)*100).toFixed(1)}%`:"No orders yet";
  const metrics=[[Users,"Active buyers",activeBuyers],[Building2,"Verified sellers",verifiedSellers],[PackageCheck,"Live products",liveProducts],[ShieldCheck,"Protected orders",protectedOrders]] as const;
  const reviews=[["Seller verification",sellerReviews],["Product verification",productReviews]] as const;
  return <main className="admin-page"><header><div><small>WEIVAS OPERATIONS</small><h1>Marketplace control centre</h1><p>Live catalogue, seller and trust operations data.</p></div><Link className="button secondary" href="/">Return to marketplace</Link></header><section className="admin-metrics">{metrics.map(([Icon,label,value])=><Card key={label}><Icon/><small>{label}</small><strong>{value.toLocaleString()}</strong></Card>)}</section><section className="admin-grid"><Card><h2>Review queue</h2>{reviews.map(([label,value])=><div className="admin-row" key={label}><CircleAlert/><span><b>{label}</b><small>Requires operations review</small></span><strong>{value.toLocaleString()}</strong></div>)}</Card><Card className="admin-dark"><small>TRUST & SAFETY</small><h2>Marketplace health</h2><strong>{completionRate}</strong><p>{allOrders?"Orders completed without intervention":"Completion rate will appear after orders are completed."}</p></Card></section></main>;
}
