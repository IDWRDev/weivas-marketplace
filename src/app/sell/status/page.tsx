import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Primitives";
import { getSession } from "@/server/auth/session";
import { db } from "@/server/db/client";

export default async function Page(){
  const session=await getSession();
  if(!session)redirect("/auth/seller-sign-in?callbackUrl=/sell/status");
  const seller=await db.sellerProfile.findUnique({where:{userId:session.user.id},include:{application:true,store:true}});
  if(!seller)redirect("/sell/onboarding");
  const labels={draft:"Draft",submitted:"Submitted",under_review:"Under Review",needs_information:"Needs Information",approved:"Approved",rejected:"Rejected",suspended:"Suspended"};
  const label=labels[seller.applicationStatus];
  return <main className="status-page"><small>SELLER APPLICATION</small><h1>{label}</h1><Badge tone={seller.applicationStatus==="approved"?"green":"orange"}>{label}</Badge>{seller.applicationStatus==="needs_information"&&<><p>{seller.application?.reviewerNotes??"Additional information is required."}</p><Link className="button" href="/sell/onboarding">Update application</Link></>}{seller.applicationStatus==="approved"&&<Link className="button" href="/seller">Open Seller Dashboard</Link>}{seller.applicationStatus==="rejected"&&<p>We could not approve this application. Contact seller support for next steps; internal review logic is not exposed.</p>}{["submitted","under_review"].includes(seller.applicationStatus)&&<p>Your application is in the review queue. Seller dashboard access remains locked until approval.</p>}{seller.applicationStatus==="draft"&&<Link className="button" href="/sell/onboarding">Resume application</Link>}</main>;
}
