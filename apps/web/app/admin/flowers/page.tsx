import type { Metadata } from "next";

import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import {
  currency,
  flowerColors,
  products,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Flowers",
};

export default function AdminFlowersPage() {
  const bouquets = products.filter(
    (product) => product.kind === "bouquet",
  );

  return (
    <AdminPage
      title="Flowers"
      description="Bouquets and single-stem arrangements."
    >
      <AdminTable
        columns={[
          "Bouquet",
          "Flower type",
          "Colours",
          "Stems",
          "Price",
        ]}
        rows={bouquets.map((product) => [
          product.name,
          product.flowerType ?? "Mixed",
          product.colors
            .map(
              (color) =>
                flowerColors.find(
                  (item) => item.slug === color,
                )?.name ?? color,
            )
            .join(", "),
          product.stems ?? "—",
          currency(product.price),
        ])}
      />
    </AdminPage>
  );
}