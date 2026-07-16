import "server-only";
import { db } from "@/server/db/client";
import type { Product } from "@/types/marketplace";

type CatalogRecord=Awaited<ReturnType<typeof getActiveCatalogProducts>>[number];
export const catalogInclude={category:true,store:{include:{sellerProfile:true}},images:{orderBy:{sortOrder:"asc" as const}}};
export async function getActiveCatalogProducts(query?:string){return db.product.findMany({where:{status:"active",stock:{gt:0},store:{status:"active"},...(query?{OR:[{title:{contains:query,mode:"insensitive"}},{description:{contains:query,mode:"insensitive"}},{category:{name:{contains:query,mode:"insensitive"}}},{store:{name:{contains:query,mode:"insensitive"}}}]}:{})},include:catalogInclude,orderBy:{updatedAt:"desc"},take:60})}
export async function getActiveCatalogProduct(slug:string){return db.product.findFirst({where:{slug,status:"active",store:{status:"active"}},include:catalogInclude})}
export function toMarketplaceProduct(product:CatalogRecord):Product{return{id:product.id,slug:product.slug,name:product.title,category:product.category.name,categorySlug:product.category.slug,sellerId:product.sellerProfileId,sellerName:product.store.name,sellerSlug:product.store.slug,price:product.priceMinor/100,oldPrice:product.compareAtPriceMinor?product.compareAtPriceMinor/100:undefined,rating:Number(product.store.rating),reviewCount:0,sold:0,emoji:"📦",sku:product.sku,stock:product.stock,status:product.stock<=0?"Out of Stock":product.stock<=product.lowStockThreshold?"Low Stock":"Active",verified:product.store.sellerProfile.verificationStatus==="verified",productVerified:true,delivery:"Delivery estimate shown at checkout",warranty:product.warrantyText??undefined,supplierCountry:product.shippingOriginCountry,moq:product.minimumOrderQuantity}}
