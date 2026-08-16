import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { MarketplaceFooter } from "@/components/layout/MarketplaceFooter";
import { db } from "@/server/db/client";

export default async function MarketplaceLayout({children}:{children:React.ReactNode}){
  const categories=await db.category.findMany({where:{status:"active"},select:{id:true,slug:true,name:true},orderBy:{name:"asc"},take:30});
  return <><MarketplaceHeader categories={categories.map(category=>({...category,icon:"•"}))}/>{children}<MarketplaceFooter/></>;
}
