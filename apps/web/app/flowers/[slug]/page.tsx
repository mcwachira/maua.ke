import { Flower2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import {
  EmptyState,
  PageHeader,
  Section,
} from "@/components/Section"

import {
  getCategory,
  productsByCategory,
} from "@/lib/catalog"

interface FlowerCategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: FlowerCategoryPageProps) {
  const { slug } = await params
  const category = getCategory(slug)

  if (!category) {
    return {
      title: "Flowers not found | Maua.ke",
      robots: {
        index: false,
      },
    }
  }

  return {
    title: `${category.name} Delivered in Kenya | Maua.ke`,
    description: category.description,
    openGraph: {
      title: `${category.name} | Maua.ke`,
      description: category.description,
    },
  }
}

export default async function FlowerCategoryPage({
  params,
}: FlowerCategoryPageProps) {
  const { slug } = await params

  const category = getCategory(slug)

  if (!category) {
    notFound()
  }

  const products = productsByCategory(slug)

  return (
    <main>
      {/* Header */}
      <PageHeader
        eyebrow="Flowers"
        title={category.name}
        description={category.description}
      />

      {/* Products */}
      <Section>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}
            </p>

            <h2 className="mt-1 font-display text-3xl sm:text-4xl">
              {category.name}
            </h2>
          </div>

          <Link
            href="/flowers"
            className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-primary"
          >
            Browse all flowers
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="py-8 sm:py-12">
            <EmptyState
              icon={<Flower2 className="size-6" />}
              title="Out of season"
              description="These aren't in the market right now. Our florists can suggest something similar."
              action={
                <Button
                  render={<Link href="/shop" />}
                >
                  Browse the shop
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Related CTA */}
      <section className="border-t border-border bg-cream">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-display text-2xl sm:text-3xl">
              Looking for something different?
            </p>

            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              Explore flowers by colour, occasion, or browse
              the complete Maua collection.
            </p>
          </div>

<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              variant="neutral"
              className="w-full rounded-full sm:w-auto"
              render={<Link href="/flowers" />}
            >
              All flowers
            </Button>

            <Button
              className="w-full rounded-full sm:w-auto"
              render={<Link href="/shop" />}
            >
              Browse the shop
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
