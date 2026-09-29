import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  AdminPage,
  AdminStat,
  AdminTable,
} from "@/components/admin/AdminShell";
import { demoTickets } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Support | Maua.ke Admin",
  description:
    "Manage Maua.ke customer support tickets.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSupportPage() {
  return (
    <AdminPage
      title="Support"
      description="Customer tickets across delivery, orders and payments."
    >
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <AdminStat
          label="Open tickets"
          value="1"
        />

        <AdminStat
          label="In progress"
          value="1"
        />

        <AdminStat
          label="Avg first response"
          value="42 min"
        />
      </div>

      <AdminTable
        columns={[
          "Subject",
          "Category",
          "Order",
          "Status",
          "Updated",
        ]}
        rows={demoTickets.map((ticket) => [
          ticket.subject,
          ticket.category,
          ticket.order,
          <Badge
            key={ticket.id}
            variant={
              ticket.status === "Resolved"
                ? "secondary"
                : "default"
            }
          >
            {ticket.status}
          </Badge>,
          ticket.updated,
        ])}
      />
    </AdminPage>
  );
}