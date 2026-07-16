import { z } from "zod";

export const profileSchema=z.object({firstName:z.string().trim().min(2).max(60),lastName:z.string().trim().min(2).max(60),phone:z.string().trim().max(30).optional(),preferredCurrency:z.string().length(3),preferredLanguage:z.string().min(2).max(8)});
export const addressSchema=z.object({label:z.string().trim().min(2).max(40),firstName:z.string().trim().min(2),lastName:z.string().trim().min(2),phone:z.string().trim().min(7),line1:z.string().trim().min(5),line2:z.string().trim().optional(),city:z.string().trim().min(2),stateRegion:z.string().trim().min(2),postalCode:z.string().trim().min(2),countryCode:z.string().length(2),isDefaultShipping:z.boolean().default(false),isDefaultBilling:z.boolean().default(false)});
