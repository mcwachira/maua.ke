"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { searchProducts, popularSearches } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/Section";
import { Button } from "@/components/ui/button";

function SearchInner() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const results = q ? searchProducts(q) : [];
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Search{q ? ` — “${q}”` : ""}</h1>
      {q.length === 0 ? (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">Try popular searches:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularSearches.map((s) => (
              <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="rounded-full border px-3 py-1 text-sm hover:bg-accent">{s}</Link>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-6"><EmptyState title="No results" description={`No products matched “${q}”. Try “roses” or “birthday”.`} action={<Button render={<Link href="/shop" />}>Browse shop</Button>} /></div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  );
}
export default function SearchPage() {
  return <Suspense fallback={<main className="mx-auto max-w-6xl px-4 py-10">Searching…</main>}><SearchInner /></Suspense>;
}
