import { notFound } from "next/navigation";
import { ProductExperience } from "@/components/marketplace/CommerceFlows";
import { products, wholesale } from "@/data/mock/marketplace";
export const dynamicParams=false;
export function generateStaticParams(){return [...products,...wholesale].map(({id})=>({slug:id})).concat({slug:"sample-product"})}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const product=slug==="sample-product"?products[0]:[...products,...wholesale].find(p=>p.id===slug);if(!product)notFound();return <ProductExperience product={product}/>}
