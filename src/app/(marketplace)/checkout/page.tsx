import { CheckoutExperience } from "@/components/marketplace/CommerceFlows";
import { requireArea } from "@/server/auth/session";
import { db } from "@/server/db/client";
export const dynamic="force-dynamic";
export default async function Page(){const session=await requireArea("account");const addresses=await db.address.findMany({where:{userId:session.user.id},orderBy:[{isDefaultShipping:"desc"},{createdAt:"asc"}]});return <CheckoutExperience addresses={addresses.map(address=>({id:address.id,label:address.label,summary:`${address.firstName} ${address.lastName} · ${address.line1}, ${address.city}, ${address.countryCode}`}))}/>}
