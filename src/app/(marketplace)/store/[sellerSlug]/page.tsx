import { FoundationPage } from "@/components/feedback/FoundationPage"; import { sellers } from "@/data/mock/marketplace";
export const dynamicParams=false;
export function generateStaticParams(){return sellers.map(({id})=>({sellerSlug:id}))}
export default async function Page({params}:{params:Promise<{sellerSlug:string}>}){const {sellerSlug}=await params;return <FoundationPage eyebrow="VERIFIED STORE" title={sellerSlug.replaceAll("-"," ")} description="Shop a trusted seller storefront on Weivas."/>}
