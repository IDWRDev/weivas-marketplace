"use server";
import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/server/db/client";
import { hashPassword } from "@/server/auth/password";
import { consumeAuthAttempt, requestIp } from "@/server/auth/rate-limit";
import { forgotPasswordSchema, registrationSchema, resetPasswordSchema } from "@/server/validators/auth";
import { getEmailService } from "@/server/email";
import { getServerEnv } from "@/server/env";

export type AuthActionState={message?:string;errors?:Record<string,string[]>};
const fieldErrors=(error:{flatten:()=>{fieldErrors:Record<string,string[]>}})=>error.flatten().fieldErrors;
const genericReset={message:"If an account matches that email, password-reset instructions will be sent."};

export async function registerAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{
  const parsed=registrationSchema.safeParse({firstName:formData.get("firstName"),lastName:formData.get("lastName"),email:formData.get("email"),phone:formData.get("phone")||undefined,password:formData.get("password"),passwordConfirmation:formData.get("passwordConfirmation"),acceptTerms:formData.get("acceptTerms")==="on"});
  if(!parsed.success)return{errors:fieldErrors(parsed.error)};
  const ip=requestIp(await headers());
  if(!await consumeAuthAttempt("register",parsed.data.email,ip,{maxAttempts:5,windowMs:60*60_000,blockMs:60*60_000}))return{message:"Unable to create an account right now. Please try again later."};
  const exists=await db.user.findUnique({where:{email:parsed.data.email},select:{id:true}});
  if(exists)return{message:"Unable to create this account. Try signing in or recovering your password."};
  const passwordHash=await hashPassword(parsed.data.password);
  const token=randomBytes(32).toString("hex");
  const tokenHash=createHash("sha256").update(token).digest("hex");
  await db.$transaction(async(tx)=>{
    await tx.user.create({data:{email:parsed.data.email,passwordHash,firstName:parsed.data.firstName,lastName:parsed.data.lastName,phone:parsed.data.phone,status:"pending",roles:{create:{role:"buyer"}},buyerProfile:{create:{}},wishlist:{create:{}},notificationPreference:{create:{}}}});
    await tx.verificationToken.create({data:{identifier:parsed.data.email,tokenHash,expires:new Date(Date.now()+24*60*60_000)}});
  });
  const verificationUrl=`${getServerEnv().NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;
  try{await getEmailService().sendVerification(parsed.data.email,verificationUrl)}catch(error){console.error("Verification email delivery failed.",error instanceof Error?error.message:"Unknown provider error");return{message:"Your account was created, but the verification email could not be delivered. Contact support for assistance."}}
  redirect(process.env.NODE_ENV==="production"?"/auth/verify-email?sent=1":`/auth/verify-email?token=${token}`);
}

export async function resendVerificationAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{
  const email=String(formData.get("email")??"").trim().toLowerCase();
  if(!email.includes("@"))return{message:"Enter a valid email address."};
  const ip=requestIp(await headers());
  if(!await consumeAuthAttempt("email-verification",email,ip,{maxAttempts:3,windowMs:60*60_000,blockMs:60*60_000}))return{message:"Please wait before requesting another verification email."};
  const user=await db.user.findUnique({where:{email},select:{email:true,emailVerifiedAt:true}});
  if(!user||user.emailVerifiedAt)return{message:"If this account needs verification, a new email will be sent."};
  const token=randomBytes(32).toString("hex");const tokenHash=createHash("sha256").update(token).digest("hex");
  await db.$transaction([db.verificationToken.deleteMany({where:{identifier:email}}),db.verificationToken.create({data:{identifier:email,tokenHash,expires:new Date(Date.now()+24*60*60_000)}})]);
  try{await getEmailService().sendVerification(email,`${getServerEnv().NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`)}catch(error){console.error("Verification email delivery failed.",error instanceof Error?error.message:"Unknown provider error")}
  return{message:"If this account needs verification, a new email will be sent."};
}

export async function forgotPasswordAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{
  const parsed=forgotPasswordSchema.safeParse({email:formData.get("email")});
  if(!parsed.success)return genericReset;
  const ip=requestIp(await headers());
  if(!await consumeAuthAttempt("password-reset",parsed.data.email,ip,{maxAttempts:4,windowMs:30*60_000,blockMs:60*60_000}))return genericReset;
  const user=await db.user.findUnique({where:{email:parsed.data.email},select:{id:true,email:true}});
  if(!user)return genericReset;
  const token=randomBytes(32).toString("hex");
  const tokenHash=createHash("sha256").update(token).digest("hex");
  await db.$transaction([db.passwordResetToken.deleteMany({where:{userId:user.id,usedAt:null}}),db.passwordResetToken.create({data:{userId:user.id,tokenHash,expires:new Date(Date.now()+30*60_000)}})]);
  try{await getEmailService().sendPasswordReset(user.email,`${getServerEnv().NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`)}catch(error){await db.passwordResetToken.deleteMany({where:{tokenHash}});console.error("Password-reset email delivery failed.",error instanceof Error?error.message:"Unknown provider error")}
  return genericReset;
}

export async function resetPasswordAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{
  const parsed=resetPasswordSchema.safeParse({token:formData.get("token"),password:formData.get("password"),passwordConfirmation:formData.get("passwordConfirmation")});
  if(!parsed.success)return{errors:fieldErrors(parsed.error)};
  const tokenHash=createHash("sha256").update(parsed.data.token).digest("hex");
  const record=await db.passwordResetToken.findUnique({where:{tokenHash}});
  if(!record||record.usedAt||record.expires<new Date())return{message:"This reset link is invalid or expired."};
  await db.$transaction([db.user.update({where:{id:record.userId},data:{passwordHash:await hashPassword(parsed.data.password),sessionVersion:{increment:1}}}),db.passwordResetToken.updateMany({where:{userId:record.userId,usedAt:null},data:{usedAt:new Date()}}),db.securityEvent.create({data:{userId:record.userId,type:"password_reset"}})]);
  redirect("/auth/sign-in?reset=1");
}
