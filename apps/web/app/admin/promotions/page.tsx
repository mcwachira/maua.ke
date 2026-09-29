import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { demoPromotions } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Promotions",
};

export default function AdminPromotionsPage() {
  return (
    <AdminPage
      title="Promotions"
      description="Discount codes and free-delivery offers."
      action={<Button size="sm">New promotion</Button>}
    >
      <AdminTable
        columns={[
          "Code",
          "Type",
          "Scope",
          "Starts",
          "Ends",
          "Status",
          "Redemptions",
        ]}
        rows={demoPromotions.map((promotion) => [
          promotion.code,
          promotion.type,
          promotion.scope,
          promotion.starts,
          promotion.ends,
          <Badge
            key={promotion.id}
            variant={
              promotion.status === "Active"
                ? "secondary"
                : "outline"
            }
          >
            {promotion.status}
          </Badge>,
          promotion.used,
        ])}
      />
    </AdminPage>
  );
}