import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  EMAIL_FROM: z.string().min(3),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  STORAGE_PROVIDER: z.enum(["development", "s3-compatible"]).default("development"),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}
