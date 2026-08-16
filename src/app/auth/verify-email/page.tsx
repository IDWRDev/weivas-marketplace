import { createHash } from "node:crypto";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { VerificationResendForm } from "@/components/auth/VerificationResendForm";
import { db } from "@/server/db/client";

export const dynamic="force-dynamic";

export default async function Page({searchParams}:{searchParams:Promise<{token?:string;sent?:string}>}){
  const {token,sent}=await searchParams;let verified=false;let invalid=false;
  if(token){const tokenHash=createHash("sha256").update(token).digest("hex");const record=await db.verificationToken.findUnique({where:{tokenHash}});if(record&&record.expires>new Date()){await db.$transaction([db.user.update({where:{email:record.identifier},data:{emailVerifiedAt:new Date(),status:"active"}}),db.verificationToken.deleteMany({where:{identifier:record.identifier}})]);verified=true}else invalid=true}
  return <AuthShell eyebrow="EMAIL VERIFICATION" title={verified?"Email verified":"Check your inbox"} copy={verified?"Your buyer account is active and ready to use.":"Verify your email before signing in to protect your account."}>{verified?<><h2>Verification complete</h2><p>You can now sign in and use your buyer dashboard.</p><Link className="button" href="/auth/sign-in?verified=1">Continue to sign in</Link></>:<><h2>{invalid?"Link expired or invalid":sent?"Verification email sent":"Verification required"}</h2><p>{invalid?"Request a fresh verification email below.":"Open the secure link sent to your email. Verification links expire after 24 hours."}</p><VerificationResendForm/></>}</AuthShell>;
}
