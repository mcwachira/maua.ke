import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { occasions, products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Occasions",
};

export default function AdminOccasionsPage() {
  return (
    <AdminPage
      title="Occasions"
      description="Seasonal and evergreen occasions shoppers browse by."
      action={<Button size="sm">New occasion</Button>}
    >
      <AdminTable
        columns={[
          "Occasion",
          "Slug",
          "Tagline",
          "Products",
        ]}
        rows={occasions.map((occasion) => [
          occasion.name,
          occasion.slug,
          occasion.tagline,
          products.filter((product) =>
            product.occasions.includes(occasion.slug),
          ).length,
        ])}
      />
    </AdminPage>
  );
}