import Link from "next/link";
import { Bell, Building2, LockKeyhole, ShieldCheck, Store } from "lucide-react";
import { Card } from "@/components/ui/Primitives";
import { requireArea } from "@/server/auth/session";
import { getApprovedSeller } from "@/server/services/sellers";

export default async function Page() {
  const session = await requireArea("seller");
  const seller = await getApprovedSeller(session.user.id);
  const store = seller.store;

  return <>
    <header className="dash-head"><div><small>SELLER CENTRE</small><h1>Settings</h1><p>Review your verified business identity, store controls, and account safeguards.</p></div><ShieldCheck aria-hidden="true" /></header>
    <div className="dash-grid">
      <Card className="span2">
        <div className="panel-heading"><div><h2>Business account</h2><small>Approval-controlled seller identity</small></div><span className="badge badge-green">Approved</span></div>
        <div className="settings-summary">
          <span><Building2 aria-hidden="true" /><small>Legal business</small><strong>{seller.legalBusinessName || "Not provided"}</strong></span>
          <span><Store aria-hidden="true" /><small>Store</small><strong>{store?.name || "Store setup pending"}</strong></span>
          <span><ShieldCheck aria-hidden="true" /><small>Verification</small><strong>{seller.verificationStatus.replaceAll("_", " ")}</strong></span>
        </div>
        <p className="settings-note">Changes to legal identity and verification documents require a reviewed support process and cannot be edited here.</p>
      </Card>
      <Card className="action-stack"><Store aria-hidden="true" /><h2>Store profile</h2><p>Edit the public store name, description, and support contacts.</p><Link className="button" href="/seller/store">Manage store</Link></Card>
      <Card className="action-stack"><Bell aria-hidden="true" /><h2>Notifications</h2><p>Seller-specific notification delivery controls will become available when messaging is connected.</p><button className="button secondary" disabled>Coming later</button></Card>
      <Card className="action-stack"><LockKeyhole aria-hidden="true" /><h2>Account security</h2><p>Password and security-event controls are shared securely with your buyer account.</p><Link className="button secondary" href="/account/security">Open security</Link></Card>
    </div>
  </>;
}
