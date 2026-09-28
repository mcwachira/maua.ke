"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/Section";
import { useShop } from "@/hooks/use-shop";
import { products } from "@/lib/catalog";

export default function WishlistPage() {
  const { wishlist, hydrated } = useShop();

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.slug),
  );

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="aspect-[4/5] animate-pulse border-2 border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl sm:text-3xl">
        Wishlist
      </h2>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-6" />}
          title="Your wishlist is waiting for something beautiful"
          description="Tap the heart on any bouquet to save it for later."
          action={
            <Button render={<Link href="/shop" />}>
              Explore flowers
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}