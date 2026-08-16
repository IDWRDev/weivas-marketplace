import { CheckoutExperience } from "@/components/marketplace/CommerceFlows";
import { requireArea } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { getServerEnv } from "@/server/env";
export const dynamic="force-dynamic";
export default async function Page(){const session=await requireArea("account","/checkout");const addresses=await db.address.findMany({where:{userId:session.user.id},orderBy:[{isDefaultShipping:"desc"},{createdAt:"asc"}]});const env=getServerEnv();return <CheckoutExperience checkoutEnabled={env.CHECKOUT_ENABLED&&env.PAYMENT_PROVIDER==="paystack"&&env.SHIPMENT_PROVIDER==="shipbubble"} addresses={addresses.map(address=>({id:address.id,label:address.label,summary:`${address.firstName} ${address.lastName} · ${address.line1}, ${address.city}, ${address.countryCode}`}))}/>}
