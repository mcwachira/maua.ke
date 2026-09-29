"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Flower2,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react"
import { useMemo, Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ProductCard } from "@/components/ProductCard"
import { EmptyState } from "@/components/Section"

import {
  flowerCategories,
  flowerColors,
  occasions,
  priceBands,
  products,
} from "@/lib/catalog"

import { cn } from "@/lib/utils"

interface ShopSearch {
  occasion?: string
  category?: string
  color?: string
  price?: string
  sort?: string
}

export default function ShopPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-14" />}>
      <ShopContent />
    </Suspense>
  )
}

function ShopContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const search: ShopSearch = {
    occasion: searchParams.get("occasion") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    color: searchParams.get("color") ?? undefined,
    price: searchParams.get("price") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  }

  const updateSearch = (patch: Partial<ShopSearch>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(patch).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    const query = params.toString()

    router.push(
      query ? `${pathname}?${query}` : pathname,
      {
        scroll: false,
      },
    )
  }

  const clearFilters = () => {
    router.push(pathname, {
      scroll: false,
    })
  }

  const results = useMemo(() => {
    let list = [...products]

    if (search.occasion) {
      const occasion = search.occasion
      list = list.filter((product) =>
        product.occasions.includes(occasion),
      )
    }

    if (search.category) {
      list = list.filter(
        (product) => product.category === search.category,
      )
    }

    if (search.color) {
      const color = search.color
      list = list.filter((product) =>
        product.colors.includes(color),
      )
    }

    if (search.price) {
      const band = priceBands.find(
        (item) => item.slug === search.price,
      )

      if (band) {
        list = list.filter(
          (product) =>
            product.price >= band.min &&
            product.price <= band.max,
        )
      }
    }

    switch (search.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price)
        break

      case "price-desc":
        list.sort((a, b) => b.price - a.price)
        break

      case "rating":
        list.sort((a, b) => b.rating - a.rating)
        break

      case "popular":
        list.sort(
          (a, b) => b.reviewCount - a.reviewCount,
        )
        break
    }

    return list
  }, [
    search.occasion,
    search.category,
    search.color,
    search.price,
    search.sort,
  ])

  const activeFilterCount = [
    search.occasion,
    search.category,
    search.color,
    search.price,
  ].filter(Boolean).length

  const activeFilters = [
    search.occasion
      ? {
        key: "occasion",
        label:
          occasions.find(
            (item) => item.slug === search.occasion,
          )?.name ?? search.occasion,
      }
      : null,

    search.category
      ? {
        key: "category",
        label:
          flowerCategories.find(
            (item) => item.slug === search.category,
          )?.name ?? search.category,
      }
      : null,

    search.color
      ? {
        key: "color",
        label:
          flowerColors.find(
            (item) => item.slug === search.color,
          )?.name ?? search.color,
      }
      : null,

    search.price
      ? {
        key: "price",
        label:
          priceBands.find(
            (item) => item.slug === search.price,
          )?.label ?? search.price,
      }
      : null,
  ].filter(Boolean) as {
    key: string
    label: string
  }[]

  const renderFilterContent = () => (
    <div className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        {/* Occasion */}
        <fieldset>
          <legend className="mb-4 font-display text-xl">
            Occasion
          </legend>

          <div className="space-y-3">
            {occasions.slice(0, 8).map((occasion) => (
              <div
                key={occasion.slug}
                className="flex items-center gap-3"
              >
                <Checkbox
                  id={`occ-${occasion.slug}`}
                  checked={
                    search.occasion === occasion.slug
                  }
                  onCheckedChange={(checked) =>
                    updateSearch({
                      occasion: checked
                        ? occasion.slug
                        : undefined,
                    })
                  }
                />

                <Label
                  htmlFor={`occ-${occasion.slug}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {occasion.name}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Flower type */}
        <fieldset>
          <legend className="mb-4 font-display text-xl">
            Flower type
          </legend>

          <div className="space-y-3">
            {flowerCategories
              .slice(0, 8)
              .map((category) => (
                <div
                  key={category.slug}
                  className="flex items-center gap-3"
                >
                  <Checkbox
                    id={`cat-${category.slug}`}
                    checked={
                      search.category === category.slug
                    }
                    onCheckedChange={(checked) =>
                      updateSearch({
                        category: checked
                          ? category.slug
                          : undefined,
                      })
                    }
                  />

                  <Label
                    htmlFor={`cat-${category.slug}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
          </div>
        </fieldset>

        {/* Colour */}
        <fieldset>
          <legend className="mb-4 font-display text-xl">
            Colour
          </legend>

          <div className="flex flex-wrap gap-2">
            {flowerColors.map((color) => {
              const active =
                search.color === color.slug

              return (
                <button
                  key={color.slug}
                  type="button"
                  onClick={() =>
                    updateSearch({
                      color: active
                        ? undefined
                        : color.slug,
                    })
                  }
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs",
                    "transition-all",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:bg-accent",
                  )}
                >
                  {color.name}
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* Price */}
        <fieldset>
          <legend className="mb-4 font-display text-xl">
            Price
          </legend>

          <div className="space-y-3">
            {priceBands.map((band) => (
              <div
                key={band.slug}
                className="flex items-center gap-3"
              >
                <Checkbox
                  id={`price-${band.slug}`}
                  checked={
                    search.price === band.slug
                  }
                  onCheckedChange={(checked) =>
                    updateSearch({
                      price: checked
                        ? band.slug
                        : undefined,
                    })
                  }
                />

                <Label
                  htmlFor={`price-${band.slug}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {band.label}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  )

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="size-4" />
              The Maua collection
            </div>

            <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Flowers, gifts & little things
              <span className="block italic text-primary">
                worth sending.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Hand-tied in Nairobi and delivered across
              Kenya. Find something beautiful for someone
              you love.
            </p>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {results.length}
              </span>{" "}
              {results.length === 1
                ? "piece"
                : "pieces"}
            </p>

            {activeFilterCount > 0 && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                · {activeFilterCount}{" "}
                {activeFilterCount === 1
                  ? "filter"
                  : "filters"}{" "}
                applied
              </span>
            )}
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            {/* Responsive Filter */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-10 flex-1 rounded-full",
                      "border border-border",
                      "bg-background",
                      "sm:flex-none",
                    )}
                  >
                    <SlidersHorizontal className="size-4" />

                    <span>Filter</span>

                    {activeFilterCount > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                }
              />

              <SheetContent
                side="bottom"
                showCloseButton
                className="overflow-hidden"
              >
                {/* Header */}
                <SheetHeader className="shrink-0 border-b border-border px-5 py-5 sm:px-7 sm:py-6">
                  <div className="pr-10">
                    <SheetTitle className="font-display text-3xl sm:text-4xl">
                      Refine your search
                    </SheetTitle>

                    <SheetDescription className="mt-1">
                      Find something that feels just right.
                    </SheetDescription>
                  </div>

                  {activeFilterCount > 0 && (
                    <div className="absolute right-14 top-6 rounded-full bg-secondary px-3 py-1.5 text-xs sm:right-16 sm:top-7">
                      {activeFilterCount} applied
                    </div>
                  )}
                </SheetHeader>

                {/* Scrollable filters */}
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
                  {renderFilterContent()}
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-border bg-background px-5 py-4 sm:px-7">
                  <div className="flex gap-3">
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-full"
                        onClick={clearFilters}
                      >
                        Clear
                      </Button>
                    )}

                    <SheetTrigger
                    render={<Button className="flex-1 rounded-full">Show {results.length}{" "}{results.length === 1 ? "item" : "items"}</Button>}
                  />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select
              value={search.sort ?? "recommended"}
              onValueChange={(value) =>
                updateSearch({
                  sort: value && value !== "recommended" ? value : undefined,
                })
              }
            >
              <SelectTrigger
                className="h-10 w-[155px] rounded-full border-border bg-background text-foreground sm:w-[190px]"
                aria-label="Sort products"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="recommended">
                  Recommended
                </SelectItem>

                <SelectItem value="popular">
                  Most popular
                </SelectItem>

                <SelectItem value="price-asc">
                  Price: low to high
                </SelectItem>

                <SelectItem value="price-desc">
                  Price: high to low
                </SelectItem>

                <SelectItem value="rating">
                  Highest rated
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-5">
            <span className="mr-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Showing
            </span>

            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() =>
                  updateSearch({
                    [filter.key]: undefined,
                  } as Partial<ShopSearch>)
                }
                className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs transition-colors hover:bg-accent"
              >
                {filter.label}

                <X className="size-3 opacity-50 transition-opacity group-hover:opacity-100" />
              </button>
            ))}

            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 text-xs underline underline-offset-4 hover:text-primary"
            >
              Clear
            </button>
          </div>
        )}

        {/* Products */}
        {results.length === 0 ? (
          <div className="py-16 sm:py-24">
            <EmptyState
              icon={<Flower2 className="size-6" />}
              title="Nothing matches those filters"
              description="Try removing a filter or browse everything currently in bloom."
              action={
                <Button onClick={clearFilters}>
                  Browse everything
                </Button>
              }
            />
          </div>
        ) : (
          <div className="pt-6 sm:pt-8">
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-blush">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-display text-2xl sm:text-3xl">
              Not sure what to send?
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Start with an occasion and let us narrow it
              down.
            </p>
          </div>

          <Button
              className="w-full rounded-full sm:w-auto"
              render={<Link href="/occasions" />}
            >
              Browse by occasion
            </Button>
        </div>
      </section>
    </main>
  )
}