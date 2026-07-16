import { notFound } from "next/navigation";
import { ProductExperience } from "@/components/marketplace/CommerceFlows";
import { allProducts, getProductBySlug } from "@/data/mock/marketplace";
export const dynamicParams=false;
export function generateStaticParams(){return allProducts.map(({slug})=>({slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const product=getProductBySlug(slug);if(!product)notFound();return <ProductExperience product={product}/>}
