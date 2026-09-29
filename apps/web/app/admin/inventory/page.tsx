import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  AdminPage,
  AdminStat,
  AdminTable,
} from "@/components/admin/AdminShell";
import { currency } from "@/lib/catalog";
import { inventoryRows } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function AdminInventoryPage() {
  const lowStock = inventoryRows.filter(
    (row) => row.available <= row.reorder,
  );

  const stockValue = inventoryRows.reduce(
    (total, row) => total + row.available * row.cost,
    0,
  );

  return (
    <AdminPage
      title="Inventory"
      description="Stems, bundles and packaging stock levels."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStat
          label="SKUs tracked"
          value={String(inventoryRows.length)}
        />

        <AdminStat
          label="Below reorder level"
          value={String(lowStock.length)}
          hint="Reorder soon"
        />

        <AdminStat
          label="Stock value"
          value={currency(stockValue)}
        />
      </div>

      <AdminTable
        columns={[
          "SKU",
          "Item",
          "Available",
          "Reserved",
          "Reorder at",
          "Cost",
          "Price",
          "Supplier",
          "Status",
        ]}
        rows={inventoryRows.map((row) => [
          row.sku,
          row.item,
          row.available,
          row.reserved,
          row.reorder,
          currency(row.cost),
          currency(row.price),
          row.supplier,
          <Badge
            key={row.sku}
            variant={
              row.available <= row.reorder
                ? "default"
                : "secondary"
            }
          >
            {row.available <= row.reorder
              ? "Low"
              : "Healthy"}
          </Badge>,
        ])}
      />
    </AdminPage>
  );
}