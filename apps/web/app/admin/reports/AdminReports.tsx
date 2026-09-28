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

import {
  AdminPage,
  AdminStat,
  AdminTable,
} from "@/components/admin/AdminShell";
import { currency } from "@/lib/catalog";
import {
  occasionSeries,
  revenueSeries,
} from "@/lib/demo-account";

const tooltipStyle = {
  background: "var(--card)",
  border: "2px solid var(--border)",
  borderRadius: 12,
  color: "var(--card-foreground)",
};

export default function AdminReports() {
  const total = revenueSeries.reduce(
    (sum, row) => sum + row.revenue,
    0,
  );

  const orders = revenueSeries.reduce(
    (sum, row) => sum + row.orders,
    0,
  );

  const averageOrderValue =
    orders > 0
      ? Math.round(total / orders)
      : 0;

  return (
    <AdminPage
      title="Reports"
      description="Revenue, orders and demand by occasion."
    >
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <AdminStat
          label="Revenue (6 months)"
          value={currency(total)}
        />

        <AdminStat
          label="Orders (6 months)"
          value={String(orders)}
        />

        <AdminStat
          label="Avg order value"
          value={currency(averageOrderValue)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-2 border-border bg-card p-4 shadow-shadow sm:p-5">
          <p className="font-display text-xl font-semibold sm:text-2xl">
            Revenue trend
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
            Orders by occasion
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

      <AdminTable
        columns={[
          "Month",
          "Revenue",
          "Orders",
          "Avg order value",
        ]}
        rows={revenueSeries.map((row) => [
          row.month,
          currency(row.revenue),
          row.orders,
          currency(
            Math.round(
              row.revenue / row.orders,
            ),
          ),
        ])}
      />
    </AdminPage>
  );
}