import { NextResponse } from "next/server";import { db } from "@/server/db/client";
export const dynamic="force-dynamic";
export async function GET(){const started=Date.now();try{await db.$queryRaw`SELECT 1`;return NextResponse.json({status:"ok",database:"reachable",latencyMs:Date.now()-started,timestamp:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}})}catch{return NextResponse.json({status:"degraded",database:"unreachable",timestamp:new Date().toISOString()},{status:503,headers:{"Cache-Control":"no-store"}})}}
