"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currency } from "@/lib/catalog";
import { api } from "@/lib/api/api";
import { useParams } from "next/navigation";

const timeline = [
  "placed",
  "confirmed",
  "preparing",
  "out-for-delivery",
  "delivered",
] as const;

interface OrderItem {
  id: string;
  name: string;
  image_url?: string | null;
  variant?: string | null;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  recipient_name: string;
  recipient_phone: string;
  delivery_address: string;
  delivery_date: string;
  delivery_slot: string;
  gift_message?: string | null;
  order_items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery<Order | null>({
    queryKey: ["order", id],
    enabled: Boolean(id),
    queryFn: async () => {
      try {
        return await api<Order>(`/orders/${id}`);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.toLowerCase().includes("not found")
        ) {
          return null;
        }

        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-28 animate-pulse bg-muted" />
        <div className="h-24 animate-pulse border-2 border-border bg-muted" />
        <div className="h-64 animate-pulse border-2 border-border bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-2 border-destructive bg-destructive/10 p-5 text-sm text-destructive">
        We couldn't load this order. Please try again.
      </div>
    );
  }

  if (!order) {
    return (
      <div className="border-2 border-border bg-card p-8 text-center shadow-shadow">
        <p className="font-display text-2xl">
          We couldn't find that order
        </p>

        <Button
          render={<Link href="/account/orders" />}
          className="mt-4"
          variant="outline"
        >
          Back to orders
        </Button>
      </div>
    );
  }

  const stepIndex = timeline.indexOf(
    order.status as (typeof timeline)[number],
  );

  return (
    <div className="space-y-6">
      <Link
        href="/account/orders"
        className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="mr-1 size-4" />
        All orders
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">
            {order.order_number}
          </h2>

          <p className="text-sm text-muted-foreground">
            Placed{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <Badge
          variant={
            order.status === "delivered"
              ? "secondary"
              : order.status === "cancelled"
                ? "destructive"
                : "default"
          }
        >
          {order.status.replace(/-/g, " ")}
        </Badge>
      </div>

      <div className="border-2 border-border bg-card p-5 shadow-shadow sm:p-6">
        <p className="font-display text-xl sm:text-2xl">
          Progress
        </p>

        <ol className="mt-5 space-y-4">
          {timeline.map((step, index) => {
            const completed = index <= stepIndex;

            return (
              <li
                key={step}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  className={[
                    "size-3 shrink-0 border-2 border-border",
                    completed
                      ? "bg-main"
                      : "bg-muted-foreground/20",
                  ].join(" ")}
                />

                <span
                  className={
                    completed
                      ? "font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {step.replace(/-/g, " ")}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="border-2 border-border bg-card p-5 shadow-shadow sm:p-6">
        <p className="font-display text-xl sm:text-2xl">
          Items
        </p>

        <ul className="mt-4 space-y-4">
          {order.order_items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt=""
                  loading="lazy"
                  width={48}
                  height={48}
                  className="size-12 shrink-0 object-cover"
                />
              )}

              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.name}</p>

                <p className="text-sm text-muted-foreground">
                  {item.variant || "Standard"} · Qty{" "}
                  {item.quantity}
                </p>
              </div>

              <p className="shrink-0 text-sm font-medium">
                {currency(
                  Number(item.unit_price) *
                  Number(item.quantity),
                )}
              </p>
            </li>
          ))}
        </ul>

        <Separator className="my-5" />

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">
              Subtotal
            </dt>
            <dd>{currency(Number(order.subtotal))}</dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">
              Delivery
            </dt>
            <dd>
              {currency(Number(order.delivery_fee))}
            </dd>
          </div>

          {Number(order.discount) > 0 && (
            <div className="flex justify-between gap-4 text-primary">
              <dt>Discount</dt>
              <dd>
                -{currency(Number(order.discount))}
              </dd>
            </div>
          )}

          <div className="flex justify-between gap-4 border-t-2 border-border pt-3 font-semibold">
            <dt>Total</dt>
            <dd>{currency(Number(order.total))}</dd>
          </div>
        </dl>
      </div>

      <div className="border-2 border-border bg-card p-5 text-sm shadow-shadow sm:p-6">
        <p className="font-display text-xl sm:text-2xl">
          Delivery
        </p>

        <p className="mt-4 font-medium">
          {order.recipient_name}
        </p>

        <p className="text-muted-foreground">
          {order.recipient_phone}
        </p>

        <p className="mt-1 text-muted-foreground">
          {order.delivery_address}
        </p>

        <p className="mt-2 text-muted-foreground">
          {order.delivery_date} · {order.delivery_slot}
        </p>

        {order.gift_message && (
          <p className="mt-4 border-2 border-border bg-secondary-background p-3 italic">
            “{order.gift_message}”
          </p>
        )}
      </div>
    </div>
  );
}