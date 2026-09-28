import type { Metadata } from "next";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { currency, products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return (
    <AdminPage
      title="Products"
      description={`${products.length} products in the catalogue.`}
      action={<Button size="sm">New product</Button>}
    >
      <AdminTable
        columns={[
          "Product",
          "Kind",
          "Category",
          "Price",
          "Variants",
          "Rating",
          "Availability",
        ]}
        rows={products.map((product) => [
          <span
            key={product.id}
            className="flex items-center gap-3"
          >
            <Image
              src={product.image}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-md object-cover"
            />

            <span className="font-medium">
              {product.name}
            </span>
          </span>,

          product.kind,
          product.category,
          currency(product.price),
          product.variants.length,
          `${product.rating} (${product.reviewCount})`,

          <Badge
            key={`${product.id}-availability`}
            variant={
              product.availability === "in-stock"
                ? "secondary"
                : "outline"
            }
          >
            {product.availability.replace(/-/g, " ")}
          </Badge>,
        ])}
      />
    </AdminPage>
  );
}