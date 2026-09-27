import type { Metadata } from "next"
import Link from "next/link"

import { ProductCard } from "@/components/ProductCard"
import { PageHeader, Section, SectionHeading } from "@/components/Section"
import { Button } from "@/components/ui/button"
import { addOns, currency, products } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Gifts & Add-ons — Chocolate, Cake, Candles | Maua.ke",
  description:
    "Pair flowers with chocolates, cake, balloons, candles and more. Gift add-ons delivered with your bouquet across Kenya.",
  openGraph: {
    title: "Gifts & Add-ons | Maua.ke",
    description:
      "Chocolates, cake, balloons and candles to go with your flowers.",
  },
}

export default function GiftsPage() {
  const giftable = products
    .filter((product) => product.kind !== "card")
    .slice(0, 8)

  return (
    <>
      <PageHeader
        eyebrow="Gifts"
        title="Flowers, and then some"
        description="Every bouquet can carry a little extra. Add chocolates, a candle or a cake at checkout."
      />

      <Section>
        <SectionHeading
          eyebrow="Add-ons"
          title="Build your gift"
          description="Prices shown are per add-on."
        />

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {addOns.map((addOn) => (
            <li
              key={addOn.id}
              className="
                flex min-h-20 items-center justify-between gap-4
                rounded-2xl border-2 border-border
                bg-card p-4 sm:p-5
                shadow-[2px_2px_0px_0px_var(--border)]
              "
            >
              <span className="font-medium leading-tight">
                {addOn.name}
              </span>

              <span className="shrink-0 text-sm text-muted-foreground">
                {currency(addOn.price)}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          Choose add-ons on any product page, or{" "}
          <Link
            href="/shop"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            start with a bouquet
          </Link>
          .
        </p>
      </Section>

      <Section className="pt-0">
        <SectionHeading
          eyebrow="Ready to send"
          title="Gift-ready favourites"
          action={
            <Button
              render={<Link href="/shop" />}
              variant="ghost"
              className="rounded-full"
            >
              Shop all
            </Button>
          }
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {giftable.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>
    </>
  )
}