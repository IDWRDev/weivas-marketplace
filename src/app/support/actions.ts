"use server";
import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/server/auth/session";
import { consumeAuthAttempt,requestIp } from "@/server/auth/rate-limit";
import { db } from "@/server/db/client";

const ticketSchema=z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().toLowerCase().email().max(254),category:z.enum(["order","account","seller","returns","payments","technical","other"]),subject:z.string().trim().min(5).max(140),message:z.string().trim().min(20).max(5000)});

export async function createSupportTicket(formData:FormData){
  const parsed=ticketSchema.safeParse(Object.fromEntries(formData));
  if(!parsed.success)redirect("/support?error=invalid");
  const ip=requestIp(await headers());
  if(!await consumeAuthAttempt("support-ticket",parsed.data.email,ip,{maxAttempts:5,windowMs:60*60_000,blockMs:60*60_000}))redirect("/support?error=rate-limit");
  const session=await getSession();
  const reference=`WVS-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${randomBytes(3).toString("hex").toUpperCase()}`;
  await db.supportTicket.create({data:{...parsed.data,reference,userId:session?.user.id}});
  redirect(`/support?submitted=${reference}`);
}
