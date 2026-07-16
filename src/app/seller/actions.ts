"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db/client";
import { requireArea } from "@/server/auth/session";
import { getApprovedSeller } from "@/server/services/sellers";
import { toSlug } from "@/lib/marketplace";

const storeSettingsSchema=z.object({name:z.string().trim().min(2),slug:z.string().trim().min(2).transform(toSlug),description:z.string().trim().min(20),supportEmail:z.string().email(),supportPhone:z.string().trim().optional(),countryCode:z.string().length(2)});
export async function updateSellerStore(formData:FormData){const session=await requireArea("seller");const seller=await getApprovedSeller(session.user.id);if(!seller.store)throw new Error("Seller store not found.");const data=storeSettingsSchema.parse({name:formData.get("name"),slug:formData.get("slug"),description:formData.get("description"),supportEmail:formData.get("supportEmail"),supportPhone:formData.get("supportPhone")||undefined,countryCode:String(formData.get("countryCode")||"").toUpperCase()});await db.store.update({where:{id:seller.store.id,sellerProfileId:seller.id},data});revalidatePath("/seller/store")}
