import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import {
  flowerCategories,
  products,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Categories",
};

export default function AdminCategoriesPage() {
  return (
    <AdminPage
      title="Categories"
      description="Groupings used across shop navigation and filters."
      action={<Button size="sm">New category</Button>}
    >
      <AdminTable
        columns={[
          "Category",
          "Slug",
          "Description",
          "Products",
        ]}
        rows={flowerCategories.map((category) => [
          category.name,
          category.slug,
          category.description,
          products.filter(
            (product) => product.category === category.slug,
          ).length,
        ])}
      />
    </AdminPage>
  );
}