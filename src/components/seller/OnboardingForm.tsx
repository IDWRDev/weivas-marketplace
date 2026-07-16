"use client";

import { useState } from "react";
import { saveSellerDraft, submitSellerApplication } from "@/app/sell/actions";

const steps = ["Contact", "Business", "Documents", "Store", "Settlement", "Review"];

export function OnboardingForm({ defaults }: { defaults?: Record<string, string> }) {
  const [step, setStep] = useState(0);
  return (
    <form className="onboarding-form">
      <ol className="onboarding-steps">
        {steps.map((label, index) => (
          <li className={index === step ? "active" : ""} key={label}>
            <button type="button" onClick={() => setStep(index)}><span>{index + 1}</span>{label}</button>
          </li>
        ))}
      </ol>
      <section hidden={step !== 0}>
        <h2>Account and contact</h2>
        <label>First name<input name="firstName" defaultValue={defaults?.firstName} /></label>
        <label>Last name<input name="lastName" defaultValue={defaults?.lastName} /></label>
        <label>Email<input name="email" type="email" defaultValue={defaults?.email} /></label>
        <label>Phone<input name="phone" defaultValue={defaults?.phone} /></label>
        <label>Country code<input name="countryCode" defaultValue={defaults?.countryCode ?? "NG"} maxLength={2} /></label>
      </section>
      <section hidden={step !== 1}>
        <h2>Business information</h2>
        <label>Legal business name<input name="legalBusinessName" defaultValue={defaults?.legalBusinessName} required /></label>
        <label>Business type<select name="businessType" defaultValue={defaults?.businessType}><option>Limited company</option><option>Sole proprietor</option><option>Partnership</option></select></label>
        <label>Registration number<input name="registrationNumber" defaultValue={defaults?.registrationNumber} required /></label>
        <label>Tax number<input name="taxNumber" defaultValue={defaults?.taxNumber} /></label>
        <label>Website<input name="website" type="url" defaultValue={defaults?.website} /></label>
        <fieldset><legend>Product categories</legend><label><input type="checkbox" name="productCategories" value="electronics" /> Electronics</label><label><input type="checkbox" name="productCategories" value="fashion" /> Fashion</label><label><input type="checkbox" name="productCategories" value="home" /> Home</label></fieldset>
      </section>
      <section hidden={step !== 2}>
        <h2>Identity and business documents</h2>
        <p className="mock-payment">Development upload placeholder. No external identity verification is active.</p>
        {["Government ID", "Business registration", "Proof of address", "Tax document (optional)"].map((label) => <label key={label}>{label}<input type="file" disabled aria-describedby="upload-note" /></label>)}
        <small id="upload-note">An approved storage provider must be configured before files can be submitted.</small>
      </section>
      <section hidden={step !== 3}>
        <h2>Store setup</h2>
        <label>Store name<input name="storeName" defaultValue={defaults?.storeName} required /></label>
        <label>Store slug<input name="storeSlug" defaultValue={defaults?.storeSlug} required /></label>
        <label>Description<textarea name="storeDescription" defaultValue={defaults?.storeDescription} required minLength={20} /></label>
        <label>Support email<input name="supportEmail" type="email" defaultValue={defaults?.supportEmail ?? defaults?.email} /></label>
        <label>Support phone<input name="supportPhone" defaultValue={defaults?.supportPhone} /></label>
      </section>
      <section hidden={step !== 4}>
        <h2>Settlement profile placeholder</h2><p>No bank credentials are collected.</p>
        <label>Preferred payout currency<input name="payoutCurrency" defaultValue={defaults?.payoutCurrency ?? "USD"} /></label>
        <label>Payout country<input name="payoutCountry" defaultValue={defaults?.payoutCountry ?? "NG"} /></label>
        <label>Payout method preference<select name="payoutMethod" defaultValue={defaults?.payoutMethod}><option>Future bank provider</option><option>Future wallet provider</option></select></label>
      </section>
      <section hidden={step !== 5}>
        <h2>Review and submit</h2><p>Review every section. Submission sends the application to an internal review queue and does not grant seller access.</p>
        <label><input type="checkbox" required /> I confirm this information is accurate and accept the seller terms.</label>
      </section>
      <div className="sticky-actions">
        <button type="button" className="button secondary" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>Previous</button>
        <button type="submit" className="button secondary" formAction={saveSellerDraft} formNoValidate>Save draft</button>
        {step < 5 ? <button type="button" className="button" onClick={() => setStep((value) => value + 1)}>Continue</button> : <button className="button" formAction={submitSellerApplication}>Submit application</button>}
      </div>
    </form>
  );
}
