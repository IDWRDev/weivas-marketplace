import { HomepageExperience } from "@/components/marketplace/HomepageExperience";
import { getActiveCatalogProducts,toMarketplaceProduct } from "@/server/services/catalog";
import { allProducts } from "@/data/mock/marketplace";
export const dynamic="force-dynamic";
export default async function Home(){let products;try{products=(await getActiveCatalogProducts()).map(toMarketplaceProduct)}catch(error){if(process.env.NODE_ENV==="production")throw error;products=allProducts}return <HomepageExperience catalogProducts={products}/>}
