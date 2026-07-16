import "server-only";
import { getServerEnv } from "@/server/env";

export interface EmailService{sendVerification(to:string,url:string):Promise<void>;sendPasswordReset(to:string,url:string):Promise<void>;sendSellerStatus(to:string,status:string):Promise<void>}

class ProviderEmailService implements EmailService{
  constructor(private apiKey:string,private from:string){}
  private async send(to:string,subject:string,html:string){const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({from:this.from,to:[to],subject,html})});if(!response.ok)throw new Error(`Email provider rejected the message (${response.status}).`)}
  sendVerification(to:string,url:string){return this.send(to,"Verify your Weivas account",`<p>Verify your Weivas account:</p><p><a href="${url}">Verify account</a></p>`)}
  sendPasswordReset(to:string,url:string){return this.send(to,"Reset your Weivas password",`<p>A password reset was requested for your Weivas account.</p><p><a href="${url}">Reset password</a></p><p>This link expires in 30 minutes. Ignore this email if you did not request it.</p>`)}
  sendSellerStatus(to:string,status:string){return this.send(to,"Your Weivas seller application",`<p>Your seller application status is now <strong>${status}</strong>.</p>`)}
}

class SafeDevelopmentEmailService implements EmailService{
  private preview(kind:string,to:string){console.info(`[email-preview] ${kind} queued for ${to}; secret links are intentionally not logged.`)}
  async sendVerification(to:string){this.preview("verification",to)}
  async sendPasswordReset(to:string){this.preview("password-reset",to)}
  async sendSellerStatus(to:string){this.preview("seller-status",to)}
}

export function getEmailService():EmailService{const env=getServerEnv();if(env.EMAIL_PROVIDER_API_KEY)return new ProviderEmailService(env.EMAIL_PROVIDER_API_KEY,env.EMAIL_FROM);if(process.env.NODE_ENV==="production")throw new Error("Production email provider is not configured.");return new SafeDevelopmentEmailService()}
