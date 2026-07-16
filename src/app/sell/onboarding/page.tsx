import { redirect } from "next/navigation";
import { WeivasLogo } from "@/components/brand/WeivasLogo";
import { OnboardingForm } from "@/components/seller/OnboardingForm";
import { getSession } from "@/server/auth/session";
import { db } from "@/server/db/client";

type DraftData = {
  contact?: Record<string, unknown>;
  application?: Record<string, unknown>;
  store?: Record<string, unknown>;
  payout?: Record<string, unknown>;
};

const stringFields = (value?: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(value ?? {}).filter((entry): entry is [string, string] => typeof entry[1] === "string"));

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/auth/seller-sign-in?callbackUrl=/sell/onboarding");

  const user = await db.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: { sellerProfile: { include: { application: true } } },
  });
  const status = user.sellerProfile?.applicationStatus;
  if (status && !["draft", "needs_information"].includes(status)) redirect("/sell/status");

  const draft = (user.sellerProfile?.application?.stepData ?? {}) as DraftData;
  const application = stringFields(draft.application);
  const store = stringFields(draft.store);
  const payout = stringFields(draft.payout);
  const defaults = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? "",
    ...stringFields(draft.contact),
    ...application,
    storeName: store.name ?? "",
    storeSlug: store.slug ?? "",
    storeDescription: store.description ?? "",
    supportEmail: store.supportEmail ?? user.email,
    supportPhone: store.supportPhone ?? "",
    payoutCurrency: payout.currency ?? "USD",
    payoutCountry: payout.country ?? "NG",
    payoutMethod: payout.method ?? "Future bank provider",
  };

  return (
    <main className="seller-onboarding">
      <header>
        <WeivasLogo className="brand-logo" />
        <div><small>SELLER ONBOARDING</small><h1>Build your Weivas storefront</h1><p>Save a draft, return later, and submit when every section is ready.</p></div>
      </header>
      <OnboardingForm defaults={defaults} />
    </main>
  );
}
