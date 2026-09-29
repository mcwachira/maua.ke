import type { Metadata } from "next";

import {
  AdminPage,
  AdminStat,
  AdminTable,
} from "@/components/admin/AdminShell";
import { currency } from "@/lib/catalog";
import { demoCustomers } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Customers",
};

export default function AdminCustomersPage() {
  return (
    <AdminPage
      title="Customers"
      description="People who have ordered from Maua.ke."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStat
          label="Total customers"
          value="1,284"
          hint="+62 this month"
        />

        <AdminStat
          label="Repeat rate"
          value="41%"
        />

        <AdminStat
          label="Lifetime value (avg)"
          value={currency(18400)}
        />
      </div>

      <AdminTable
        columns={[
          "Customer",
          "Email",
          "Phone",
          "Orders",
          "Total spend",
          "Joined",
        ]}
        rows={demoCustomers.map((customer) => [
          customer.name,
          customer.email,
          customer.phone,
          customer.orders,
          currency(customer.spend),
          customer.joined,
        ])}
      />
    </AdminPage>
  );
}