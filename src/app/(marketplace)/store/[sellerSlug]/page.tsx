import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreExperience } from "@/components/marketplace/CommerceFlows";
import { db } from "@/server/db/client";
import { catalogInclude, toMarketplaceProduct } from "@/server/services/catalog";

export const dynamic="force-dynamic";
async function getStore(slug:string){return db.store.findFirst({where:{slug,status:"active"},include:{sellerProfile:true,products:{where:{status:"active",stock:{gt:0}},include:catalogInclude,orderBy:{updatedAt:"desc"},take:60}}})}
export async function generateMetadata({params}:{params:Promise<{sellerSlug:string}>}):Promise<Metadata>{const{sellerSlug}=await params;const store=await getStore(sellerSlug);if(!store)return{title:"Store not found"};return{title:store.name,description:(store.description??`Shop approved products from ${store.name} on Weivas.`).slice(0,160),alternates:{canonical:`/store/${store.slug}`}}}
export default async function Page({params}:{params:Promise<{sellerSlug:string}>}){const{sellerSlug}=await params;const store=await getStore(sellerSlug);if(!store)notFound();return <StoreExperience seller={{id:store.sellerProfileId,storeId:store.id,slug:store.slug,name:store.name,logo:"W",country:store.countryCode,rating:Number(store.rating),feedback:0,responseRate:store.responseRate,completedOrders:0,featured:[],verified:store.sellerProfile.verificationStatus==="verified"}} products={store.products.map(toMarketplaceProduct)}/>}
