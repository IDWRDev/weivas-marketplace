import { z } from "zod";

const strongPassword = z.string().min(10).regex(/[A-Z]/,"Add an uppercase letter").regex(/[a-z]/,"Add a lowercase letter").regex(/[0-9]/,"Add a number").regex(/[^A-Za-z0-9]/,"Add a symbol");
export const registrationSchema = z.object({
  firstName:z.string().trim().min(2).max(60), lastName:z.string().trim().min(2).max(60), email:z.string().trim().toLowerCase().email(), phone:z.string().trim().max(30).optional(), password:strongPassword, passwordConfirmation:z.string(), acceptTerms:z.literal(true),
}).refine((data)=>data.password===data.passwordConfirmation,{path:["passwordConfirmation"],message:"Passwords do not match"});
export const signInSchema = z.object({email:z.string().trim().toLowerCase().email(),password:z.string().min(1)});
export const forgotPasswordSchema = z.object({email:z.string().trim().toLowerCase().email()});
export const resetPasswordSchema = z.object({token:z.string().min(32),password:strongPassword,passwordConfirmation:z.string()}).refine((data)=>data.password===data.passwordConfirmation,{path:["passwordConfirmation"],message:"Passwords do not match"});
export const changePasswordSchema = z.object({currentPassword:z.string().min(1),password:strongPassword,passwordConfirmation:z.string()}).refine((data)=>data.password===data.passwordConfirmation,{path:["passwordConfirmation"],message:"Passwords do not match"});
