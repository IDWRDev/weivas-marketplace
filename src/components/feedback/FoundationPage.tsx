import Link from "next/link";
import { ArrowRight, CircleCheck, Clock3, ShieldCheck } from "lucide-react";

export function FoundationPage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  const sellerArea = eyebrow.includes("SELLER");
  const homeHref = sellerArea ? "/seller" : "/account";
  const actionHref = sellerArea ? "/seller/orders" : "/account/orders";

  return <>
    <header className="dash-head"><div><small>{eyebrow}</small><h1>{title}</h1><p>{description}</p></div></header>
    <section className="card premium-empty workspace-state" aria-labelledby="workspace-state-title">
      <span className="state-icon"><Clock3 aria-hidden="true" /></span>
      <small>READY WHEN ACTIVITY ARRIVES</small>
      <h2 id="workspace-state-title">Nothing needs your attention here</h2>
      <p>This workspace is prepared for real account activity. New records will appear here only when they belong to your signed-in account.</p>
      <div className="state-assurances" aria-label="Workspace safeguards">
        <span><ShieldCheck aria-hidden="true" /> Account protected</span>
        <span><CircleCheck aria-hidden="true" /> No fictional activity</span>
      </div>
      <div className="state-actions">
        <Link className="button" href={actionHref}>Review orders <ArrowRight aria-hidden="true" /></Link>
        <Link className="button secondary" href={homeHref}>Back to dashboard</Link>
      </div>
    </section>
  </>;
}
