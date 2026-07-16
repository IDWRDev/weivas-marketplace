import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { db } from "@/server/db/client";
import { catalogInclude,toMarketplaceProduct } from "@/server/services/catalog";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const category=await db.category.findUnique({where:{slug}});if(!category)notFound();const shown=(await db.product.findMany({where:{categoryId:category.id,status:"active",stock:{gt:0},store:{status:"active"}},include:catalogInclude,orderBy:{updatedAt:"desc"}})).map(toMarketplaceProduct);return <main className="commerce-page category-page"><nav className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>{category.name}</span></nav><header className="category-hero"><span className="eyebrow">SHOP THE CATEGORY</span><h1>{category.name}</h1><p>Approved products from active Weivas sellers.</p></header><div className="search-toolbar"><b>{shown.length} products</b></div>{shown.length?<div className="product-grid">{shown.map(product=><ProductCard key={product.id} product={product}/>)}</div>:<div className="empty"><b>No live products in this category yet.</b></div>}</main>}
