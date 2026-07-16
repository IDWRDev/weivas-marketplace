import { CartExperience } from "@/components/marketplace/CommerceFlows";
import { getSession } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { catalogInclude,toMarketplaceProduct } from "@/server/services/catalog";
export const dynamic="force-dynamic";
export default async function Page(){const session=await getSession();if(!session)return <CartExperience/>;const cart=await db.cart.findUnique({where:{userId:session.user.id},include:{items:{include:{product:{include:catalogInclude}}}}});const active=(cart?.items??[]).filter(item=>item.product.status==="active"&&item.product.store.status==="active");return <CartExperience persistedItems={active.map(item=>({productId:item.productId,quantity:item.quantity}))} persistedProducts={active.map(item=>toMarketplaceProduct(item.product))}/>}
