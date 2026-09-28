import type { Metadata } from "next";

import { AdminPage, AdminTable } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { addOns, currency } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Add-ons",
};

export default function AdminAddOnsPage() {
  return (
    <AdminPage
      title="Add-ons"
      description="Extras customers can attach at checkout."
      action={<Button size="sm">New add-on</Button>}
    >
      <AdminTable
        columns={["Add-on", "Price", "Status"]}
        rows={addOns.map((addOn) => [
          addOn.name,
          currency(addOn.price),
          "Active",
        ])}
      />
    </AdminPage>
  );
}