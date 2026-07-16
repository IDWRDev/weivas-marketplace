import { HomepageExperience } from "@/components/marketplace/HomepageExperience";
import { getActiveCatalogProducts,toMarketplaceProduct } from "@/server/services/catalog";
export const dynamic="force-dynamic";
export default async function Home(){const products=(await getActiveCatalogProducts()).map(toMarketplaceProduct);return <HomepageExperience catalogProducts={products}/>}
