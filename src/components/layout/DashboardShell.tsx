"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, BadgeCheck, BarChart3, Bell, Boxes, BriefcaseBusiness, Clock, CreditCard, Heart, House, KeyRound, MapPin, Megaphone, Menu, MessageCircle, Package, RotateCcw, Settings, ShieldAlert, ShoppingBag, Store, Truck, Users, X } from "lucide-react";
import { WeivasLogo } from "@/components/brand/WeivasLogo";

const buyer=[[House,"Overview","/account"],[Package,"Orders","/account/orders"],[Truck,"Tracking","/account/tracking"],[Heart,"Wishlist","/account/wishlist"],[Clock,"Recently Viewed","/account/recently-viewed"],[MessageCircle,"Messages","/account/messages"],[RotateCcw,"Returns","/account/returns"],[CreditCard,"Refunds","/account/refunds"],[ShieldAlert,"Disputes","/account/disputes"],[MapPin,"Addresses","/account/addresses"],[CreditCard,"Payment Methods","/account/payment-methods"],[Bell,"Notifications","/account/notifications"],[KeyRound,"Security","/account/security"],[Settings,"Account Settings","/account/settings"]] as const;
const seller=[[House,"Command Centre","/seller"],[Package,"Products","/seller/products"],[Boxes,"Inventory","/seller/inventory"],[Truck,"Orders","/seller/orders"],[RotateCcw,"Returns","/seller/returns"],[BarChart3,"Analytics","/seller/analytics"],[Megaphone,"Marketing","/seller/marketing"],[Users,"Customers","/seller/customers"],[CreditCard,"Payouts","/seller/payouts"],[Store,"Storefront","/seller/store"],[Settings,"Business Settings","/seller/settings"]] as const;
type SellerState="none"|"draft"|"submitted"|"under_review"|"needs_information"|"approved"|"rejected"|"suspended";

export function DashboardShell({kind,sellerState="none",children}:{kind:"buyer"|"seller";sellerState?:SellerState;children:React.ReactNode}){
  const links=kind==="buyer"?buyer:seller;const pathname=usePathname();const [open,setOpen]=useState(false);const root=kind==="buyer"?"/account":"/seller";
  const sellerHref=sellerState==="approved"?"/seller":sellerState==="none"?"/sell/onboarding":"/sell/status";
  const sellerLabel=sellerState==="approved"?"Open Seller Centre":sellerState==="none"?"Start selling":"Seller application";
  const nav=<nav aria-label={`${kind} navigation`}>{links.map(([Icon,label,url])=>{const active=pathname===url||(url!==root&&pathname.startsWith(`${url}/`));return <Link href={url} key={label} className={active?"active":""} aria-current={active?"page":undefined} onClick={()=>setOpen(false)}><Icon aria-hidden="true"/><span>{label}</span></Link>})}</nav>;
  return <div className={`dashboard-shell ${kind}-workspace ${open?"nav-open":""}`}>
    <header className="dashboard-mobile-head"><Link href="/"><WeivasLogo className="dashboard-logo"/></Link><span>{kind==="seller"?"Seller Centre":"Buyer Account"}</span><button type="button" aria-expanded={open} aria-controls="dashboard-sidebar" aria-label={open?"Close account navigation":"Open account navigation"} onClick={()=>setOpen(value=>!value)}>{open?<X/>:<Menu/>}</button></header>
    {open&&<button className="dashboard-scrim" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}
    <aside id="dashboard-sidebar"><Link href="/"><WeivasLogo className="dashboard-logo"/></Link><p>{kind==="buyer"?"BUYER ACCOUNT":"SELLER OPERATING CENTRE"}</p>{nav}<div className="workspace-switch"><small>SWITCH WORKSPACE</small>{kind==="seller"?<Link href="/account"><ShoppingBag aria-hidden="true"/>Buyer dashboard</Link>:<Link href={sellerHref}><BriefcaseBusiness aria-hidden="true"/>{sellerLabel}</Link>}</div><div className="verified"><BadgeCheck aria-hidden="true"/> {kind==="seller"?"Approved seller access":"Protected buyer account"}</div></aside>
    <div className="dashboard-main"><div className="dashboard-context"><span><Activity aria-hidden="true"/> {kind==="seller"?"Seller operating centre":"Personal buyer account"}</span><div><Link href={kind==="seller"?"/account":sellerHref}>{kind==="seller"?"Buyer dashboard":sellerLabel}</Link><Link href="/">Marketplace</Link></div></div>{children}</div>
  </div>;
}
