import { notFound } from "next/navigation";
import { StoreExperience } from "@/components/marketplace/CommerceFlows";
import { sellers } from "@/data/mock/marketplace";
export const dynamicParams=false;
export function generateStaticParams(){return sellers.map(({id})=>({sellerSlug:id})).concat({sellerSlug:"sample-seller"})}
export default async function Page({params}:{params:Promise<{sellerSlug:string}>}){const {sellerSlug}=await params;const seller=sellerSlug==="sample-seller"?sellers[0]:sellers.find(s=>s.id===sellerSlug);if(!seller)notFound();return <StoreExperience seller={seller}/>}
