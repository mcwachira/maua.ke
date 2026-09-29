import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  AdminPage,
  AdminStat,
  AdminTable,
} from "@/components/admin/AdminShell";
import { demoDeliveries } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Deliveries",
};

export default function AdminDeliveriesPage() {
  return (
    <AdminPage
      title="Deliveries"
      description="Rider assignments and delivery progress."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStat
          label="Scheduled today"
          value="14"
        />

        <AdminStat
          label="Unassigned"
          value="3"
          hint="Needs a rider"
        />

        <AdminStat
          label="On-time rate"
          value="96%"
        />
      </div>

      <AdminTable
        columns={[
          "Order",
          "Recipient",
          "Zone",
          "Slot",
          "Agent",
          "Status",
        ]}
        rows={demoDeliveries.map((delivery) => [
          delivery.order,
          delivery.recipient,
          delivery.area,
          delivery.slot,
          "—",
          <Badge
            key={delivery.id}
            variant={
              delivery.status === "Delivered"
                ? "secondary"
                : "default"
            }
          >
            {delivery.status}
          </Badge>,
        ])}
      />
    </AdminPage>
  );
}