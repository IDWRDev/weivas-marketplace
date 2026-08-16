import { HomepageExperience } from "@/components/marketplace/HomepageExperience";
import { getActiveCatalogProducts,toMarketplaceProduct } from "@/server/services/catalog";
import { db } from "@/server/db/client";
export const dynamic="force-dynamic";
export default async function Home(){const[records,categories,stores]=await Promise.all([getActiveCatalogProducts(),db.category.findMany({where:{status:"active"},orderBy:{name:"asc"},take:12}),db.store.findMany({where:{status:"active",sellerProfile:{verificationStatus:"verified"}},select:{id:true,slug:true,name:true,countryCode:true,products:{where:{status:"active"},select:{id:true}}},take:6})]);return <HomepageExperience catalogProducts={records.map(toMarketplaceProduct)} categories={categories.map(category=>({id:category.id,slug:category.slug,name:category.name,icon:"•"}))} featuredStores={stores.map(store=>({id:store.id,slug:store.slug,name:store.name,country:store.countryCode,verified:true,productCount:store.products.length}))}/>}
