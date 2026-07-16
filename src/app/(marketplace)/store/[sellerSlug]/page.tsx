import { notFound } from "next/navigation";
import { StoreExperience } from "@/components/marketplace/CommerceFlows";
import { getSellerBySlug, sellers } from "@/data/mock/marketplace";
export const dynamicParams=false;
export function generateStaticParams(){return sellers.map(({slug})=>({sellerSlug:slug}))}
export default async function Page({params}:{params:Promise<{sellerSlug:string}>}){const {sellerSlug}=await params;const seller=getSellerBySlug(sellerSlug);if(!seller)notFound();return <StoreExperience seller={seller}/>}
