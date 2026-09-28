"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currency, type Product } from "@/lib/catalog";
import { useShop } from "@/hooks/use-shop";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const {
    addItem,
    toggleWishlist,
    isWishlisted,
  } = useShop();

  const wished = isWishlisted(product.slug);
  const defaultVariant = product.variants[0];

  const isSoldOut =
    product.availability === "out-of-stock";

  const isLowStock =
    product.availability === "low-stock";

  const quickAdd = () => {
    if (!defaultVariant || isSoldOut) {
      return;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      variantId: defaultVariant.id,
      variantName: defaultVariant.name,
      unitPrice: defaultVariant.price,
      quantity: 1,
      addOnIds: [],
    });

    toast.success(
      `${product.name} added to your basket`,
    );
  };

  const productHref = `/products/${product.slug}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card",
        "transition-[box-shadow,transform] duration-300",
        "hover:shadow-lift",
        "focus-within:ring-2 focus-within:ring-primary/30",
        isSoldOut && "opacity-95",
      )}
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link
          href={productHref}
          className="absolute inset-0"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="
              (max-width: 479px) 100vw,
              (max-width: 639px) 50vw,
              (max-width: 1023px) 50vw,
              (max-width: 1279px) 33vw,
              25vw
            "
            className={cn(
              "object-cover transition-transform duration-500",
              "group-hover:scale-105",
              isSoldOut && "grayscale-[15%]",
            )}
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <Badge
            className="absolute left-3 top-3 max-w-[calc(100%-5rem)] truncate bg-primary text-primary-foreground shadow-sm"
          >
            {product.badge}
          </Badge>
        )}

        {/* Wishlist */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wished}
          onClick={() => {
            toggleWishlist(product.slug);

            toast(
              wished
                ? "Removed from wishlist"
                : "Saved to your wishlist",
            );
          }}
          className={cn(
            "absolute right-3 top-3 z-10 h-9 w-9 rounded-full",
            "bg-background/90 shadow-soft backdrop-blur-sm",
            "transition-transform duration-200",
            "hover:scale-105 hover:bg-background",
            "sm:h-10 sm:w-10",
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 sm:h-[18px] sm:w-[18px]",
              wished &&
                "fill-primary text-primary",
            )}
          />
        </Button>

        {/* Sold out */}
        {isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 z-[1] bg-foreground/80 px-3 py-2 text-center text-xs font-medium text-background backdrop-blur-sm sm:text-sm">
            Sold out
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-3.5 sm:p-4">
        {/* Rating + availability */}
        <div className="flex min-h-5 items-center gap-1.5 text-xs text-muted-foreground">
          <Star
            className="h-3.5 w-3.5 shrink-0 fill-gold text-gold"
            aria-hidden="true"
          />

          <span className="font-medium text-foreground">
            {product.rating.toFixed(1)}
          </span>

          <span>
            ({product.reviewCount})
          </span>

          {isLowStock && (
            <span className="ml-auto truncate text-primary">
              Only a few left
            </span>
          )}
        </div>

        {/* Product name */}
        <h3 className="font-display text-lg leading-tight sm:text-xl">
          <Link
            href={productHref}
            className="transition-colors hover:text-primary focus:outline-none focus:text-primary"
          >
            {product.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        {/* Price + Add */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-2 sm:pt-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold sm:text-base">
              {currency(product.price)}
            </p>

            {product.compareAtPrice && (
              <p className="truncate text-xs text-muted-foreground line-through">
                {currency(product.compareAtPrice)}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant={"noShadow"}
            size="sm"
            onClick={quickAdd}
            disabled={
              isSoldOut || !defaultVariant
            }
            className="shrink-0 rounded-full px-3 sm:px-4"
            aria-label={
              isSoldOut
                ? `${product.name} is sold out`
                : `Add ${product.name} to basket`
            }
          >
            <ShoppingBag className="mr-1.5 h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {/* Image skeleton */}
      <div className="aspect-square animate-pulse bg-muted" />

      {/* Content skeleton */}
      <div className="space-y-3 p-3.5 sm:p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />

        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />

        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>

        <div className="flex items-end justify-between gap-3 pt-2">
          <div className="space-y-1.5">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-14 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-9 w-16 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
