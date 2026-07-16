"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db/client";
import { getSession } from "@/server/auth/session";
import { sellerApplicationSchema, storeSchema } from "@/server/validators/seller";

async function userSession() {
  const session = await getSession();
  if (!session) redirect("/auth/seller-sign-in?callbackUrl=/sell/onboarding");
  if (session.user.status !== "active") redirect("/auth/unauthorised?reason=account-status");
  return session;
}

function formSnapshot(formData: FormData) {
  return {
    contact: {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      countryCode: String(formData.get("countryCode") ?? "").toUpperCase(),
    },
    application: {
      legalBusinessName: String(formData.get("legalBusinessName") ?? ""),
      businessType: String(formData.get("businessType") ?? ""),
      registrationNumber: String(formData.get("registrationNumber") ?? ""),
      taxNumber: String(formData.get("taxNumber") ?? ""),
      countryCode: String(formData.get("countryCode") ?? "").toUpperCase(),
      website: String(formData.get("website") ?? ""),
      productCategories: formData.getAll("productCategories").map(String),
    },
    store: {
      name: String(formData.get("storeName") ?? ""),
      slug: String(formData.get("storeSlug") ?? ""),
      description: String(formData.get("storeDescription") ?? ""),
      countryCode: String(formData.get("countryCode") ?? "").toUpperCase(),
      supportEmail: String(formData.get("supportEmail") ?? ""),
      supportPhone: String(formData.get("supportPhone") ?? ""),
    },
    payout: {
      currency: String(formData.get("payoutCurrency") ?? ""),
      country: String(formData.get("payoutCountry") ?? ""),
      method: String(formData.get("payoutMethod") ?? ""),
    },
  };
}

export async function saveSellerDraft(formData: FormData) {
  const session = await userSession();
  const snapshot = formSnapshot(formData);

  await db.$transaction(async (tx) => {
    const existing = await tx.sellerProfile.findUnique({ where: { userId: session.user.id } });
    if (existing && existing.applicationStatus !== "draft" && existing.applicationStatus !== "needs_information") {
      throw new Error("This application can no longer be edited.");
    }

    const profile = await tx.sellerProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, applicationStatus: "draft" },
      update: {},
    });
    await tx.sellerApplication.upsert({
      where: { sellerProfileId: profile.id },
      create: { sellerProfileId: profile.id, status: "draft", stepData: snapshot },
      update: { status: "draft", stepData: snapshot },
    });
  });
  revalidatePath("/sell/onboarding");
}

export async function submitSellerApplication(formData: FormData) {
  const session = await userSession();
  const snapshot = formSnapshot(formData);
  const application = sellerApplicationSchema.parse(snapshot.application);
  const store = storeSchema.parse(snapshot.store);

  await db.$transaction(async (tx) => {
    const existingSlug = await tx.store.findFirst({
      where: { slug: store.slug, sellerProfile: { userId: { not: session.user.id } } },
      select: { id: true },
    });
    if (existingSlug) throw new Error("That store URL is already in use.");

    const profile = await tx.sellerProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, ...application, applicationStatus: "under_review" },
      update: { ...application, applicationStatus: "under_review" },
    });
    await tx.sellerApplication.upsert({
      where: { sellerProfileId: profile.id },
      create: {
        sellerProfileId: profile.id,
        status: "under_review",
        submittedAt: new Date(),
        stepData: snapshot,
      },
      update: { status: "under_review", submittedAt: new Date(), stepData: snapshot },
    });
    await tx.store.upsert({
      where: { sellerProfileId: profile.id },
      create: { sellerProfileId: profile.id, ...store, status: "pending_approval" },
      update: { ...store, status: "pending_approval" },
    });
  });
  redirect("/sell/status");
}
