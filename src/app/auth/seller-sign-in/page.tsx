import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/AuthForms";

export const metadata:Metadata={title:"Seller sign in"};
export default async function SellerSignInPage({searchParams}:{searchParams:Promise<{callbackUrl?:string}>}){const params=await searchParams;return <AuthShell eyebrow="WEIVAS SELLER CENTRE" title="Run your business with confidence." copy="Dedicated access for approved sellers to manage products, inventory, fulfilment, analytics and storefront operations."><span className="portal-badge">SELLER PORTAL</span><h2>Seller sign in</h2><p>Use the account connected to your seller application.</p><SignInForm callbackUrl={params.callbackUrl??"/seller"} buttonLabel="Open Seller Centre"/><p>Application not approved yet? <Link href="/sell/status">Check seller status</Link></p><p>Shopping on Weivas? <Link href="/auth/sign-in">Use buyer sign in</Link></p></AuthShell>}
