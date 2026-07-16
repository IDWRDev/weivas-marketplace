import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { WeivasLogo } from "@/components/brand/WeivasLogo";
export function AuthShell({eyebrow,title,copy,children}:{eyebrow:string;title:string;copy:string;children:React.ReactNode}){return <main className="auth-page"><section className="auth-brand"><Link href="/"><WeivasLogo className="auth-logo"/></Link><div><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div><small><ShieldCheck/> Protected account foundation · no live payment data collected</small></section><section className="auth-card">{children}</section></main>}
