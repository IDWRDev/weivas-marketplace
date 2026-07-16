import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { categories, getCategoryBySlug, getProductsByCategorySlug } from "@/data/mock/marketplace";
export const dynamicParams=false;
export function generateStaticParams(){return categories.map(({slug})=>({slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const category=getCategoryBySlug(slug);if(!category) notFound();const shown=getProductsByCategorySlug(slug);return <main className="commerce-page category-page"><nav className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>{category.name}</span></nav><header className="category-hero"><span className="eyebrow">SHOP THE CATEGORY</span><h1>{category.name}</h1><p>Handpicked products from verified sellers, with clear delivery and protection information.</p></header><div className="search-toolbar"><b>{shown.length} products</b><select aria-label="Sort products"><option>Recommended</option><option>Top rated</option><option>Price: low to high</option></select></div><div className="product-grid">{shown.map(p=><ProductCard key={p.id} product={p}/>)}</div></main>}
