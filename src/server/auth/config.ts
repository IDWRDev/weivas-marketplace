import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db/client";
import { signInSchema } from "@/server/validators/auth";
import { verifyPassword } from "@/server/auth/password";
import { consumeAuthAttempt } from "@/server/auth/rate-limit";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/auth/sign-in", error: "/auth/sign-in" },
  providers: [CredentialsProvider({
    name: "Weivas credentials",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials,request) {
      const parsed = signInSchema.safeParse(credentials);
      if (!parsed.success) return null;
      const forwarded=request.headers?.["x-forwarded-for"];
      const ip=(Array.isArray(forwarded)?forwarded[0]:forwarded)?.split(",")[0]?.trim()||"unknown";
      if(!await consumeAuthAttempt("sign-in",parsed.data.email,ip,{maxAttempts:8,windowMs:15*60_000,blockMs:30*60_000}))return null;
      const user = await db.user.findUnique({ where: { email: parsed.data.email }, include: { sellerProfile: true } });
      if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash)) || user.status !== "active") return null;
      return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`, role: user.primaryRole, status: user.status, sellerApplicationStatus: user.sellerProfile?.applicationStatus,sessionVersion:user.sessionVersion };
    },
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; token.role = user.role; token.status = user.status; token.sellerApplicationStatus = user.sellerApplicationStatus;token.sessionVersion=user.sessionVersion;
      } else if (token.id) {
        const current = await db.user.findUnique({ where: { id: token.id }, include: { sellerProfile: true } });
        if (current) {
          token.role = current.primaryRole;
          token.status = token.sessionVersion===current.sessionVersion?current.status:"disabled";
          token.sellerApplicationStatus = current.sellerProfile?.applicationStatus;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id; session.user.role = token.role; session.user.status = token.status; session.user.sellerApplicationStatus = token.sellerApplicationStatus;session.user.sessionVersion=token.sessionVersion;
      }
      return session;
    },
  },
  cookies: { sessionToken: { name: process.env.NODE_ENV === "production" ? "__Secure-weivas.session-token" : "weivas.session-token", options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" } } },
  secret: process.env.AUTH_SECRET,
};
