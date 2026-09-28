import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  AdminPage,
  AdminStat,
  AdminTable,
} from "@/components/admin/AdminShell";
import { currency } from "@/lib/catalog";
import { demoOrders } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <AdminPage
      title="Orders"
      description="Every order placed across the store."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat
          label="Open orders"
          value="18"
          hint="Awaiting fulfilment"
        />

        <AdminStat
          label="Out for delivery"
          value="6"
        />

        <AdminStat
          label="Delivered today"
          value="9"
        />

        <AdminStat
          label="Cancelled (30d)"
          value="3"
        />
      </div>

      <AdminTable
        columns={[
          "Order",
          "Date",
          "Customer",
          "Recipient",
          "Zone",
          "Payment",
          "Status",
          "Total",
        ]}
        rows={demoOrders.map((order) => [
          order.orderNumber,
          order.date,
          order.customer,
          order.recipient,
          order.zone,
          <Badge
            key={`${order.id}-payment`}
            variant={
              order.paymentStatus === "paid"
                ? "secondary"
                : "outline"
            }
          >
            {order.paymentStatus}
          </Badge>,
          <Badge key={`${order.id}-status`}>
            {order.status.replace(/-/g, " ")}
          </Badge>,
          currency(order.total),
        ])}
      />
    </AdminPage>
  );
}