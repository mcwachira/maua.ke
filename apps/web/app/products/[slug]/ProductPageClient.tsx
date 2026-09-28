"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Check,
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { ProductCard } from "@/components/ProductCard"
import {
  Section,
  SectionHeading,
} from "@/components/Section"

import {
  addOns as allAddOns,
  currency,
  getOccasion,
  greetingCards,
  products,
  reviewsFor,
} from "@/lib/catalog"

import { cn } from "@/lib/utils"
import { useShop } from "@/hooks/use-shop"

interface ProductPageClientProps {
  product: ReturnType<
    typeof import("@/lib/catalog").getProduct
  > extends infer T
    ? NonNullable<T>
    : never
}

export default function ProductPageClient({
                                            product,
                                          }: ProductPageClientProps) {
  const {
    addItem,
    toggleWishlist,
    isWishlisted,
  } = useShop()

  const [variantId, setVariantId] = useState(
    product.variants[0]?.id ?? "",
  )

  const [quantity, setQuantity] = useState(1)

  const [selectedAddOns, setSelectedAddOns] =
    useState<string[]>([])

  const [cardId, setCardId] =
    useState<string>("none")

  const [message, setMessage] = useState("")

  const [signature, setSignature] = useState("")

  const [activeImage, setActiveImage] = useState(0)

  const [adding, setAdding] = useState(false)

  const variant =
    product.variants.find(
      (v) => v.id === variantId,
    ) ?? product.variants[0]!

  const card = greetingCards.find(
    (c) => c.id === cardId,
  )

  const addOnTotal = selectedAddOns.reduce(
    (sum, id) =>
      sum +
      (allAddOns.find(
        (addon) => addon.id === id,
      )?.price ?? 0),
    0,
  )

  const unitTotal =
    variant.price +
    addOnTotal +
    (card?.price ?? 0)

  const productReviews = reviewsFor(product.slug)

  const related = products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.occasions.some((occasion) =>
          product.occasions.includes(occasion),
        ),
    )
    .slice(0, 4)

  const wished = isWishlisted(product.slug)

  const handleAdd = () => {
    setAdding(true)

    setTimeout(() => {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        variantId: variant.id,
        variantName: variant.name,
        unitPrice: variant.price,
        quantity,
        addOnIds: selectedAddOns,
        cardId: card?.id,
        cardName: card?.name,
        cardPrice: card?.price,
        message: message || undefined,
        signature: signature || undefined,
      })

      setAdding(false)

      toast.success(
        `${product.name} added to your basket`,
      )
    }, 400)
  }

  const activeImageSrc =
    product.gallery[activeImage] ?? product.image

  return (
    <main>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-primary"
            >
              Home
            </Link>
          </li>

          <li aria-hidden>/</li>

          <li>
            <Link
              href="/shop"
              className="transition-colors hover:text-primary"
            >
              Shop
            </Link>
          </li>

          <li aria-hidden>/</li>

          <li className="max-w-[220px] truncate text-foreground sm:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product */}
      <Section className="py-6 sm:py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Gallery */}
          <div className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-border bg-muted">
              <Image
                src={activeImageSrc}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {product.gallery.length > 1 && (
              <div className="mt-3 flex max-w-full gap-2.5 overflow-x-auto pb-1 sm:gap-3">
                {product.gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveImage(index)
                    }
                    aria-label={`View image ${
                      index + 1
                    }`}
                    aria-pressed={
                      index === activeImage
                    }
                    className={cn(
                      "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:size-20",
                      index === activeImage
                        ? "border-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {product.badge && (
                <Badge>{product.badge}</Badge>
              )}

              {product.occasions
                .slice(0, 3)
                .map((occasion) => (
                  <Link
                    key={occasion}
                    href={`/occasions/${occasion}`}
                  >
                    <Badge
                      variant="secondary"
                      className="transition-colors hover:bg-accent"
                    >
                      {getOccasion(occasion)?.name ??
                        occasion}
                    </Badge>
                  </Link>
                ))}
            </div>

            {/* Name */}
            <h1 className="mt-3 font-display text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
              <span className="flex items-center gap-1">
                <Star
                  className="size-4 fill-gold text-gold"
                  aria-hidden
                />

                <span className="font-medium">
                  {product.rating.toFixed(1)}
                </span>
              </span>

              <span className="text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>

              <span
                className="hidden text-muted-foreground sm:inline"
                aria-hidden
              >
                ·
              </span>

              <span
                className={
                  product.availability ===
                  "out-of-stock"
                    ? "text-destructive"
                    : "text-sage-foreground"
                }
              >
                {product.availability ===
                "in-stock"
                  ? "In stock"
                  : product.availability ===
                  "low-stock"
                    ? "Only a few left today"
                    : "Sold out"}
              </span>
            </div>

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <p className="font-display text-3xl sm:text-4xl">
                {currency(unitTotal)}
              </p>

              {product.compareAtPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  {currency(
                    product.compareAtPrice,
                  )}
                </p>
              )}
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {product.description}
            </p>

            <div className="mt-7 space-y-7">
              {/* Size */}
              <div>
                <Label className="eyebrow text-muted-foreground">
                  Size
                </Label>

                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {product.variants.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setVariantId(item.id)
                      }
                      aria-pressed={
                        item.id === variant.id
                      }
                      className={cn(
                        "rounded-xl border-2 p-3 text-left text-sm transition-all",
                        item.id === variant.id
                          ? "border-primary bg-accent"
                          : "border-border hover:bg-accent",
                      )}
                    >
                      <span className="block font-medium">
                        {item.name}
                      </span>

                      <span className="mt-1 block text-xs text-muted-foreground">
                        {item.stems
                          ? `${item.stems} stems · `
                          : ""}
                        {currency(item.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Greeting card */}
              <div>
                <Label className="eyebrow text-muted-foreground">
                  Add a greeting card
                </Label>

                <Select
                  value={cardId}
                  onValueChange={(value) => setCardId(value ?? "none")}
                >
                  <SelectTrigger
                    className="mt-2 w-full"
                    aria-label="Greeting card"
                  >
                    <SelectValue placeholder="No card" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">
                      No card
                    </SelectItem>

                    {greetingCards.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                      >
                        {item.name} —{" "}
                        {currency(item.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div>
                <Label
                  htmlFor="message"
                  className="eyebrow text-muted-foreground"
                >
                  Personal message
                </Label>

                <Textarea
                  id="message"
                  maxLength={250}
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Happy Birthday! I hope your day is as beautiful as you are."
                  className="mt-2 min-h-28"
                />

                <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:justify-between">
                  <span>
                    Handwritten onto your card by our
                    florists.
                  </span>

                  <span>
                    {message.length}/250
                  </span>
                </div>

                <Input
                  value={signature}
                  onChange={(event) =>
                    setSignature(event.target.value)
                  }
                  placeholder="Sign off (optional) — e.g. Love, James"
                  aria-label="Signature"
                  className="mt-2"
                />
              </div>

              {/* Add-ons */}
              <div>
                <Label className="eyebrow text-muted-foreground">
                  Make it more
                </Label>

                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {allAddOns.map((addon) => (
                    <label
                      key={addon.id}
                      className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 border-border p-3 text-sm transition-colors hover:bg-accent"
                    >
                      <Checkbox
                        checked={selectedAddOns.includes(
                          addon.id,
                        )}
                        onCheckedChange={(checked) =>
                          setSelectedAddOns((previous) =>
                            checked
                              ? previous.includes(
                                addon.id,
                              )
                                ? previous
                                : [
                                  ...previous,
                                  addon.id,
                                ]
                              : previous.filter(
                                (id) =>
                                  id !== addon.id,
                              ),
                          )
                        }
                      />

                      <span className="min-w-0 flex-1">
                        {addon.name}
                      </span>

                      <span className="shrink-0 text-muted-foreground">
                        {currency(addon.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div className="border-t border-border pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {/* Quantity */}
                  <div className="flex h-11 w-fit items-center gap-1 rounded-full border-2 border-border p-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-full"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        setQuantity((current) =>
                          Math.max(
                            1,
                            current - 1,
                          ),
                        )
                      }
                    >
                      <Minus className="size-4" />
                    </Button>

                    <span className="w-8 text-center text-sm font-medium">
                      {quantity}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-full"
                      aria-label="Increase quantity"
                      onClick={() =>
                        setQuantity(
                          (current) => current + 1,
                        )
                      }
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  {/* Add to basket */}
                  <Button
                    size="lg"
                    className="min-h-11 flex-1 rounded-full"
                    disabled={
                      product.availability ===
                      "out-of-stock" ||
                      adding
                    }
                    onClick={handleAdd}
                  >
                    {adding
                      ? "Adding…"
                      : `Add to basket · ${currency(
                        unitTotal * quantity,
                      )}`}
                  </Button>

                  {/* Wishlist */}
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-h-11 rounded-full sm:w-auto"
                    aria-pressed={wished}
                    onClick={() => {
                      toggleWishlist(product.slug)

                      toast(
                        wished
                          ? "Removed from wishlist"
                          : "Saved to your wishlist",
                      )
                    }}
                  >
                    <Heart
                      className={cn(
                        "size-4",
                        wished &&
                        "fill-primary text-primary",
                      )}
                    />

                    <span>Wishlist</span>
                  </Button>
                </div>
              </div>

              {/* Delivery */}
              <div className="flex items-start gap-3 rounded-2xl border-2 border-border bg-cream p-4 text-sm leading-6">
                <Truck className="mt-0.5 size-5 shrink-0 text-primary" />

                <p>
                  Same-day delivery in Nairobi on
                  orders placed before 3:00 PM. Choose
                  your delivery date and time window at
                  checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Tabs */}
      <Section className="pt-0">
        <Tabs defaultValue="details">
          <div className="max-w-full overflow-x-auto">
            <TabsList className="inline-flex min-w-max">
              <TabsTrigger value="details">
                Details
              </TabsTrigger>

              <TabsTrigger value="care">
                Care
              </TabsTrigger>

              <TabsTrigger value="delivery">
                Delivery
              </TabsTrigger>

              <TabsTrigger value="reviews">
                Reviews ({productReviews.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="details"
            className="mt-6 max-w-2xl space-y-0 text-sm"
          >
            <Row
              label="Flower type"
              value={product.flowerType ?? "Mixed"}
            />

            <Row
              label="Stems"
              value={
                variant.stems
                  ? `${variant.stems}`
                  : "Varies"
              }
            />

            <Row
              label="Size"
              value={variant.name}
            />

            <Row
              label="Colours"
              value={product.colors.join(", ")}
            />

            <Row
              label="Vase"
              value={
                product.vaseAvailable
                  ? "Available as an add-on"
                  : "Not included"
              }
            />

            {product.includes && (
              <Row
                label="Includes"
                value={product.includes.join(
                  ", ",
                )}
              />
            )}
          </TabsContent>

          <TabsContent
            value="care"
            className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground"
          >
            <p>
              {product.careInstructions ??
                "Keep somewhere cool and out of direct sun, and change the water every two days."}
            </p>
          </TabsContent>

          <TabsContent
            value="delivery"
            className="mt-6 max-w-2xl space-y-3 text-sm text-muted-foreground"
          >
            <DeliveryPoint>
              Same-day across Nairobi before 3:00 PM
            </DeliveryPoint>

            <DeliveryPoint>
              Next-day to Mombasa, Kisumu, Nakuru and
              Eldoret
            </DeliveryPoint>

            <DeliveryPoint>
              Choose morning, afternoon or evening
              windows
            </DeliveryPoint>
          </TabsContent>

          <TabsContent
            value="reviews"
            className="mt-6 space-y-4"
          >
            {productReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reviews yet — be the first once your
                order is delivered.
              </p>
            ) : (
              productReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border-2 border-border bg-card p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">
                      {review.author}
                    </span>

                    {review.verified && (
                      <Badge variant="secondary">
                        Verified purchase
                      </Badge>
                    )}

                    <span className="ml-auto flex items-center gap-1">
                      <Star
                        className="size-3.5 fill-gold text-gold"
                        aria-hidden
                      />

                      {review.rating}
                    </span>
                  </div>

                  <p className="mt-2 font-medium">
                    {review.title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {review.comment}
                  </p>
                </article>
              ))
            )}
          </TabsContent>
        </Tabs>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section className="pt-0">
          <SectionHeading title="You might also like" />

          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}
          </div>
        </Section>
      )}
    </main>
  )
}

function DeliveryPoint({
                         children,
                       }: {
  children: React.ReactNode
}) {
  return (
    <p className="flex items-start gap-2">
      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
      <span>{children}</span>
    </p>
  )
}

function Row({
               label,
               value,
             }: {
  label: string
  value: string
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-6 py-3">
        <span className="shrink-0 text-muted-foreground">
          {label}
        </span>

        <span className="text-right font-medium capitalize">
          {value}
        </span>
      </div>

      <Separator />
    </>
  )
}
