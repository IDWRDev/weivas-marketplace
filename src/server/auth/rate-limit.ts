import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/server/db/client";

type Limit={maxAttempts:number;windowMs:number;blockMs:number};
const hash=(value:string)=>createHash("sha256").update(value).digest("hex");

export async function consumeAuthAttempt(scope:string,identifier:string,ip:string,limit:Limit){
  const keyHash=hash(`${scope}:${identifier.trim().toLowerCase()}:${ip}`);
  const now=new Date();
  return db.$transaction(async tx=>{
    const current=await tx.authRateLimit.findUnique({where:{keyHash}});
    if(current?.blockedUntil&&current.blockedUntil>now)return false;
    const windowExpired=!current||now.getTime()-current.windowStartedAt.getTime()>=limit.windowMs;
    const attempts=windowExpired?1:(current?.attempts??0)+1;
    const blockedUntil=attempts>limit.maxAttempts?new Date(now.getTime()+limit.blockMs):null;
    await tx.authRateLimit.upsert({where:{keyHash},create:{keyHash,attempts,windowStartedAt:now,blockedUntil},update:{attempts,windowStartedAt:windowExpired?now:current!.windowStartedAt,blockedUntil}});
    return !blockedUntil;
  });
}

export function requestIp(headers:Headers){return headers.get("x-forwarded-for")?.split(",")[0]?.trim()||headers.get("x-real-ip")||"unknown"}
