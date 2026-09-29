"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  AdminPage,
  AdminStat,
  AdminTable,
} from "@/components/admin/AdminShell";
import { currency } from "@/lib/catalog";
import {
  demoDeliveries,
  demoOrders,
  occasionSeries,
  revenueSeries,
} from "@/lib/demo-account";

const tooltipStyle = {
  background: "var(--card)",
  border: "2px solid var(--border)",
  borderRadius: 12,
  color: "var(--card-foreground)",
};

export default function AdminDashboard() {
  return (
    <AdminPage
      title="Dashboard"
      description="Last 6 months of demo trading data."
    >
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <AdminStat
          label="Revenue (Aug)"
          value={currency(745000)}
          hint="+20% vs July"
        />

        <AdminStat
          label="Orders (Aug)"
          value="176"
          hint="+19% vs July"
        />

        <AdminStat
          label="Avg order value"
          value={currency(4233)}
          hint="Across all zones"
        />

        <AdminStat
          label="Deliveries today"
          value="14"
          hint="3 awaiting assignment"
        />

        <AdminStat
          label="Customers"
          value="1,284"
          hint="+62 this month"
        />

        <AdminStat
          label="Low stock items"
          value="3"
          hint="Below reorder level"
        />

        <AdminStat
          label="Pending payments"
          value="2"
          hint="M-Pesa awaiting callback"
        />

        <AdminStat
          label="Reviews to moderate"
          value="5"
          hint="Submitted this week"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-2 border-border bg-card p-4 shadow-shadow sm:p-5">
          <p className="font-display text-xl font-semibold sm:text-2xl">
            Revenue over time
          </p>

          <div className="mt-4 h-60 min-w-0 sm:h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={revenueSeries}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />

                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />

                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  width={60}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border-2 border-border bg-card p-4 shadow-shadow sm:p-5">
          <p className="font-display text-xl font-semibold sm:text-2xl">
            Popular occasions
          </p>

          <div className="mt-4 h-60 min-w-0 sm:h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={occasionSeries}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />

                <XAxis
                  dataKey="occasion"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                />

                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  width={40}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Bar
                  dataKey="orders"
                  fill="var(--color-chart-1)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-xl font-semibold sm:text-2xl">
          Recent orders
        </h2>

        <AdminTable
          columns={[
            "Order",
            "Customer",
            "Recipient",
            "Delivery",
            "Status",
            "Total",
          ]}
          rows={demoOrders.map((order) => [
            order.order,
            order.customer,
            order.recipient,
            order.date,
            <Badge
              key={order.id}
              variant={
                order.status === "delivered"
                  ? "secondary"
                  : "default"
              }
            >
              {order.status.replace(/-/g, " ")}
            </Badge>,
            currency(order.total),
          ])}
        />
      </div>

      <div>
        <h2 className="mb-3 font-display text-xl font-semibold sm:text-2xl">
          Today&apos;s deliveries
        </h2>

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
            delivery.status,
          ])}
        />
      </div>
    </AdminPage>
  );
}