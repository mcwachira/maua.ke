import type { Metadata } from "next";

import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { currency, products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Care Packages",
};

export default function AdminCarePackagesPage() {
  const packages = products.filter(
    (product) =>
      product.kind === "care-package" ||
      product.kind === "gift",
  );

  return (
    <AdminPage
      title="Care packages"
      description="Curated hampers and gift bundles."
    >
      <AdminTable
        columns={[
          "Package",
          "Includes",
          "Price",
          "Availability",
        ]}
        rows={packages.map((product) => [
          product.name,
          <span
            key={product.id}
            className="text-sm text-muted-foreground"
          >
            {(product.includes ?? []).join(" · ") || "—"}
          </span>,
          currency(product.price),
          product.availability.replace(/-/g, " "),
        ])}
      />
    </AdminPage>
  );
}