import { notFound } from "next/navigation";
import { ProductExperience } from "@/components/marketplace/CommerceFlows";
import { getActiveCatalogProduct,toMarketplaceProduct } from "@/server/services/catalog";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const product=await getActiveCatalogProduct(slug);if(!product)notFound();return <ProductExperience product={toMarketplaceProduct(product)}/>}
