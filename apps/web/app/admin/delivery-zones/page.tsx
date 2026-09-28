import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import {
  currency,
  deliverySlots,
  deliveryZones,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Delivery Zones",
};

export default function AdminDeliveryZonesPage() {
  return (
    <AdminPage
      title="Delivery zones"
      description="Coverage, fees and same-day cut-off times."
      action={<Button size="sm">New zone</Button>}
    >
      <AdminTable
        columns={[
          "Zone",
          "Slug",
          "Fee",
          "Same day",
          "Cut-off",
        ]}
        rows={deliveryZones.map((zone) => [
          zone.name,
          zone.slug,
          currency(zone.fee),
          <Badge
            key={zone.slug}
            variant={
              zone.sameDay ? "secondary" : "outline"
            }
          >
            {zone.sameDay ? "Yes" : "No"}
          </Badge>,
          zone.cutoff,
        ])}
      />

      <section>
        <h2 className="mb-3 font-display text-2xl sm:text-3xl">
          Delivery slots
        </h2>

        <AdminTable
          columns={["Slot", "Window", "Status"]}
          rows={deliverySlots.map((slot) => [
            slot.label,
            slot.window,
            "Active",
          ])}
        />
      </section>
    </AdminPage>
  );
}