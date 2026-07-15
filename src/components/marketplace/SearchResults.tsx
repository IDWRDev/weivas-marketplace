"use client";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/mock/marketplace";
import { ProductCard } from "@/components/marketplace/ProductCard";

export function SearchResults(){const params=useSearchParams();const q=params.get("q")??"";const filtered=products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));return <main className="section search-page"><span>SEARCH RESULTS</span><h1>{q?`Results for “${q}”`:"Explore all products"}</h1>{filtered.length?<div className="product-grid">{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty"><b>No products found</b><p>Try a broader search or browse our categories.</p></div>}</main>}
