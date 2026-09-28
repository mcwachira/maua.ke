"use client"

import Link from "next/link"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader, Section } from "@/components/Section"
import { currency, greetingCards } from "@/lib/catalog"

export default function CardsPageClient() {
  const categories = [
    "All",
    ...Array.from(new Set(greetingCards.map((card) => card.category))),
  ]

  const [active, setActive] = useState("All")

  const visible =
    active === "All"
      ? greetingCards
      : greetingCards.filter((card) => card.category === active)

  return (
    <>
      <PageHeader
        eyebrow="Cards"
        title="The words matter most"
        description="Pick a card, write your message, and our florists will handwrite it before delivery."
      />

      <Section>
        <div
          className="mb-8 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
          role="group"
          aria-label="Filter greeting cards"
        >
          {categories.map((category) => {
            const isActive = active === category

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                aria-pressed={isActive}
                className={`
                  shrink-0 rounded-full border-2 px-4 py-2
                  text-sm font-medium transition-all
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--border)]"
                    : "border-border bg-background hover:bg-accent"
                }
                `}
              >
                {category}
              </button>
            )
          })}
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((card) => (
            <li
              key={card.id}
              className="
                flex h-full min-h-[280px] flex-col
                rounded-2xl border-2 border-border
                bg-card p-5 sm:p-6
                shadow-[2px_2px_0px_0px_var(--border)]
              "
            >
              <Badge variant="secondary" className="w-fit">
                {card.category}
              </Badge>

              <p className="mt-4 font-display text-2xl leading-tight sm:text-3xl">
                {card.name}
              </p>

              <p className="mt-3 flex-1 rounded-xl bloom-gradient p-4 font-display text-lg italic leading-relaxed sm:text-xl">
                “{card.preview}”
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  {currency(card.price)}
                </span>

                <Button
                  render={<Link href="/shop" />}
                  size="sm"
                  variant="noShadow"
                  className="shrink-0 rounded-full"
                >
                  Add to a bouquet
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {visible.length === 0 && (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-border p-8 text-center">
            <p className="font-display text-xl">No cards found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another category.
            </p>
          </div>
        )}
      </Section>
    </>
  )
}