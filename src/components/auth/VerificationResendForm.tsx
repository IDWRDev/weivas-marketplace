"use client";
import { useActionState } from "react";
import { resendVerificationAction, type AuthActionState } from "@/app/auth/actions";
const initial:AuthActionState={};
export function VerificationResendForm(){const[state,action,pending]=useActionState(resendVerificationAction,initial);return <form action={action} className="auth-form"><label>Email address<input name="email" type="email" required autoComplete="email"/></label>{state.message&&<p role="status" className="form-message">{state.message}</p>}<button className="button secondary" disabled={pending}>{pending?"Sending…":"Resend verification email"}</button></form>}
