import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
export function Button({className,children,...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button className={cn("button",className)} {...props}>{children}</button>}
export function Card({children,className=""}:{children:ReactNode;className?:string}){return <section className={cn("card",className)}>{children}</section>}
export function Badge({children,tone="orange"}:{children:ReactNode;tone?:"orange"|"green"|"red"}){return <span className={`badge badge-${tone}`}>{children}</span>}
