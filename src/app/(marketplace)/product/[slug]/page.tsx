import { FoundationPage } from "@/components/feedback/FoundationPage"; import { products,wholesale } from "@/data/mock/marketplace";
export const dynamicParams=false;
export function generateStaticParams(){return [...products,...wholesale].map(({id})=>({slug:id}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <FoundationPage eyebrow="PRODUCT" title={slug.replaceAll("-"," ")} description="Verified seller, protected payment, and delivery information will appear here."/>}
