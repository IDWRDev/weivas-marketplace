import { FoundationPage } from "@/components/feedback/FoundationPage"; import { categories } from "@/data/mock/marketplace";
export const dynamicParams=false;
export function generateStaticParams(){return categories.map(({name})=>({slug:name.toLowerCase().replaceAll(" ","-")}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <FoundationPage eyebrow="CATEGORY" title={slug.replaceAll("-"," ")} description="Browse handpicked products from verified sellers."/>}
