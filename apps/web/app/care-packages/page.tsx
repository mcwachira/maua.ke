import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader, Section } from "@/components/Section";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Care Packages — Flowers, Treats & Self-Care | Maua.ke",
  description:
    "Curated care packages pairing flowers with chocolate, candles, tea and a handwritten card. Delivered across Kenya.",
  openGraph: {
    title: "Care Packages | Maua.ke",
    description:
      "Flowers paired with treats, self-care items and a card.",
  },
};

export default function CarePackagesPage() {
  const packages = products.filter(
    (product) => product.kind === "care-package",
  );

  return (
    <>
      <PageHeader
        eyebrow="Care packages"
        title="A whole gesture in one box"
        description="Flowers plus the things that make a hard week softer — boxed, ribboned and delivered."
      />

      <Section>
        {/* Product grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
          {packages.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* What's inside */}
        {packages.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <div className="mb-6 sm:mb-8">
              <p className="eyebrow text-primary">Inside the box</p>
              <h2 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
                What each package includes
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {packages.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="flex h-full flex-col rounded-2xl border-2 border-border bg-card p-4 shadow-[2px_2px_0px_0px_var(--border)] transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--border)] sm:p-5"
                >
                  <p className="font-display text-xl leading-tight sm:text-2xl">
                    {product.name}
                  </p>

                  {product.includes && product.includes.length > 0 ? (
                    <ul className="mt-3 space-y-1.5 text-sm leading-5 text-muted-foreground">
                      {product.includes.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden="true">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      A carefully curated gift package.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {packages.length === 0 && (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-border p-8 text-center sm:p-12">
            <p className="font-display text-2xl">Care packages are coming soon</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We&apos;re preparing some thoughtful packages for you.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}