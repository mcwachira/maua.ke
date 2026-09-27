// app/occasions/page.tsx

import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader, Section } from "@/components/Section"
import { occasions, productsByOccasion } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Shop Flowers by Occasion | Maua.ke",
  description:
    "Birthdays, anniversaries, Valentine's, sympathy and more — find the right flowers and gifts for the moment.",
  openGraph: {
    title: "Shop Flowers by Occasion | Maua.ke",
    description: "Find the right flowers and gifts for every moment.",
  },
}

export default function OccasionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Occasions"
        title="What are you celebrating?"
        description="Every arrangement is tagged to the moment it was made for — start there and the choosing gets easy."
      />

      <Section>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => {
            const productCount = productsByOccasion(occasion.slug).length

            return (
              <li key={occasion.slug} className="h-full">
                <Link
                  href={`/occasions/${occasion.slug}`}
                  className="
                    group flex h-full min-h-[220px] flex-col
                    rounded-2xl border-2 border-border
                    bg-card p-5 sm:p-6
                    shadow-[2px_2px_0px_0px_var(--border)]
                    transition-all duration-200
                    hover:-translate-x-[1px] hover:-translate-y-[1px]
                    hover:shadow-[4px_4px_0px_0px_var(--border)]
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-ring
                    focus-visible:ring-offset-2
                  "
                >
                  <span className="eyebrow text-primary">
                    {occasion.tagline}
                  </span>

                  <span
                    className="
                      mt-2 font-display text-2xl leading-tight
                      transition-colors
                      group-hover:text-primary
                      sm:text-3xl
                    "
                  >
                    {occasion.name}
                  </span>

                  <span className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground sm:text-base">
                    {occasion.description}
                  </span>

                  <span className="mt-auto pt-6 text-xs font-medium text-muted-foreground">
                    {productCount}{" "}
                    {productCount === 1 ? "product" : "products"}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Section>
    </>
  )
}