import { Suspense } from "react";
import { SearchResults } from "@/components/marketplace/SearchResults";

export default function SearchPage(){return <Suspense fallback={<main className="section search-page"><span>SEARCH RESULTS</span><h1>Finding handpicked products…</h1></main>}><SearchResults/></Suspense>}
