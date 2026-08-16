import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  EMAIL_FROM: z.string().min(3),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  PAYMENT_PROVIDER: z.enum(["none", "paystack", "flutterwave"]).default("none"),
  PAYMENT_SECRET_KEY: z.string().optional(),
  PAYMENT_PUBLIC_KEY: z.string().optional(),
  MARKETPLACE_CURRENCY: z.string().length(3).default("NGN"),
  STORAGE_PROVIDER: z.enum(["development", "s3-compatible"]).default("development"),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  STORAGE_ENDPOINT: z.string().url().optional(),
  STORAGE_PUBLIC_URL: z.string().url().optional(),
  SHIPMENT_PROVIDER: z.enum(["none", "shipbubble"]).default("none"),
  SHIPBUBBLE_API_KEY: z.string().optional(),
}).superRefine((env,ctx)=>{
  if(env.PAYMENT_PROVIDER!=="none"&&(!env.PAYMENT_SECRET_KEY||!env.PAYMENT_PUBLIC_KEY))ctx.addIssue({code:"custom",message:"Payment provider keys are required when online payments are enabled."});
  if(env.STORAGE_PROVIDER==="s3-compatible"&&(!env.STORAGE_BUCKET||!env.STORAGE_ACCESS_KEY||!env.STORAGE_SECRET_KEY||!env.STORAGE_ENDPOINT||!env.STORAGE_PUBLIC_URL))ctx.addIssue({code:"custom",message:"R2 storage settings are incomplete."});
  if(env.SHIPMENT_PROVIDER==="shipbubble"&&!env.SHIPBUBBLE_API_KEY)ctx.addIssue({code:"custom",message:"Shipbubble API key is required when shipping is enabled."});
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}
