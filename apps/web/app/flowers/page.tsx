import Link from "next/link"

import {
  flowerCategories,
  flowerColors,
  productsByCategory,
} from "@/lib/catalog"

import {
  PageHeader,
  Section,
  SectionHeading,
} from "@/components/Section"

export const metadata = {
  title: "Fresh Flowers — Roses, Tulips, Lilies & More | Maua.ke",
  description:
    "Browse roses, tulips, lilies, sunflowers, orchids and seasonal bouquets, hand-tied in Nairobi and delivered across Kenya.",
  openGraph: {
    title: "Fresh Flowers | Maua.ke",
    description:
      "Roses, tulips, lilies, sunflowers and seasonal bouquets.",
  },
}

export default function FlowersPage() {
  return (
    <main>
      {/* Header */}
      <PageHeader
        eyebrow="Flowers"
        title="Browse the flower market"
        description="Choose by flower or by colour — every stem is sourced fresh each morning."
      />

      {/* Flower categories */}
      <Section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Freshly selected
            </p>

            <h2 className="mt-1 font-display text-3xl sm:text-4xl">
              Find your flower
            </h2>
          </div>

          <Link
            href="/shop"
            className="hidden text-sm font-medium underline underline-offset-4 transition-colors hover:text-primary sm:block"
          >
            Shop everything
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {flowerCategories.map((category) => {
            const productCount = productsByCategory(
              category.slug,
            ).length

            return (
              <li key={category.slug}>
                <Link
                  href={`/flowers/${category.slug}`}
                  className="group flex min-h-[180px] h-full flex-col rounded-2xl border-2 border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft sm:min-h-[200px] sm:p-6"
                >
                  <div className="flex flex-1 flex-col">
                    <span className="font-display text-2xl leading-tight transition-colors group-hover:text-primary sm:text-3xl">
                      {category.name}
                    </span>

                    <span className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground">
                      {productCount}{" "}
                      {productCount === 1
                        ? "product"
                        : "products"}
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-lg transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <Link
          href="/shop"
          className="mt-6 flex items-center justify-center rounded-full border-2 border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary sm:hidden"
        >
          Shop everything
        </Link>
      </Section>

      {/* Shop by colour */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Shop by colour"
          title="Pick a palette"
        />

        <ul className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
          {flowerColors.map((color) => (
            <li key={color.slug}>
              <Link
                href={`/shop?color=${encodeURIComponent(
    color.slug,
)}`}
                className="inline-flex min-h-11 items-center rounded-full border-2 border-border bg-background px-4 py-2.5 text-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[2px_2px_0px_0px_var(--border)] sm:px-5"
              >
                {color.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Mobile-friendly CTA */}
      <section className="border-t border-border bg-blush">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-display text-2xl sm:text-3xl">
              Not sure which flowers to choose?
            </p>

            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              Browse by occasion and find something suited to
              birthdays, anniversaries, congratulations and
              everyday moments.
            </p>
          </div>

          <Link
            href="/occasions"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-border bg-main px-6 py-3 text-sm font-medium text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Browse by occasion
          </Link>
        </div>
      </section>
    </main>
  )
}
