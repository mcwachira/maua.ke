import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  AdminPage,
  AdminStat,
  AdminTable,
} from "@/components/admin/AdminShell";
import { currency } from "@/lib/catalog";
import { demoPayments } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Payments",
};

export default function AdminPaymentsPage() {
  return (
    <AdminPage
      title="Payments"
      description="M-Pesa and card transactions with payout status."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStat
          label="Collected (Aug)"
          value={currency(745000)}
        />

        <AdminStat
          label="Pending callbacks"
          value="2"
          hint="M-Pesa STK"
        />

        <AdminStat
          label="Refunded (30d)"
          value={currency(3500)}
        />
      </div>

      <AdminTable
        columns={[
          "Order",
          "Method",
          "Reference",
          "Amount",
          "Status",
          "Date",
        ]}
        rows={demoPayments.map((payment) => [
          payment.order,
          payment.method,
          payment.reference,
          currency(payment.amount),
          <Badge
            key={payment.id}
            variant={
              payment.status === "Paid"
                ? "secondary"
                : "outline"
            }
          >
            {payment.status}
          </Badge>,
          payment.date,
        ])}
      />
    </AdminPage>
  );
}