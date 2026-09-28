"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/catalog";
import { useShop } from "@/hooks/use-shop";
import { api } from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";

interface AccountOrder {
  id: string;
  order_number: string;
  total: number;
  status: string;
  recipient_name: string;
  created_at: string;
}

interface AccountReminder {
  id: string;
  title: string;
  remind_on: string;
}

interface AccountOverviewResponse {
  orders: AccountOrder[];
  reminders: AccountReminder[];
}

export default function AccountPage() {
  const { wishlist } = useShop();
  const { user } = useAuth();

  const { data, isLoading, isError } =
    useQuery<AccountOverviewResponse>({
      queryKey: ["account-overview", user?.id],
      enabled: Boolean(user?.id),
      queryFn: () =>
        api<AccountOverviewResponse>("/account/overview"),
    });

  const orders = data?.orders ?? [];
  const reminders = data?.reminders ?? [];

  const spend = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse border-2 border-border bg-muted"
            />
          ))}
        </div>

        <div className="h-48 animate-pulse border-2 border-border bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-2 border-destructive bg-destructive/10 p-5 text-sm text-destructive">
        We couldn't load your account information. Please refresh
        and try again.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ul className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Orders",
            value: String(orders.length),
          },
          {
            label: "Total spent",
            value: currency(spend),
          },
          {
            label: "Saved items",
            value: String(wishlist.length),
          },
        ].map((stat) => (
          <li
            key={stat.label}
            className="border-2 border-border bg-card p-4 shadow-shadow sm:p-5"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>

            <p className="mt-1 font-display text-2xl sm:text-3xl">
              {stat.value}
            </p>
          </li>
        ))}
      </ul>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl">
            Recent orders
          </h2>

          <Button
            render={<Link href="/account/orders" />}
            variant="ghost"
            size="sm"
          >
            View all
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="border-2 border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            You haven't placed an order yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.slice(0, 2).map((order) => (
              <li
                key={order.id}
                className="border-2 border-border bg-card p-4 shadow-shadow sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {order.order_number}
                    </p>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {new Date(
                        order.created_at,
                      ).toLocaleDateString()}{" "}
                      · for {order.recipient_name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {order.status.replace(/-/g, " ")}
                    </Badge>

                    <p className="font-medium">
                      {currency(Number(order.total))}
                    </p>
                  </div>

                  <Button
                    render={
                      <Link
                        href={`/account/orders/${order.id}`}
                      />
                    }
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Details
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl">
            Coming up
          </h2>

          <Button
            render={<Link href="/account/reminders" />}
            variant="ghost"
            size="sm"
          >
            Manage reminders
          </Button>
        </div>

        {reminders.length === 0 ? (
          <div className="border-2 border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No reminders saved yet.
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="border-2 border-border bg-card p-5 shadow-shadow"
              >
                <p className="font-display text-xl">
                  {reminder.title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {reminder.remind_on}
                </p>

                <Button
                  render={<Link href="/shop" />}
                  size="sm"
                  className="mt-4 w-full sm:w-auto"
                >
                  Send flowers
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}