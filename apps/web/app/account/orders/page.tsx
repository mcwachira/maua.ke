"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/Section";
import { currency } from "@/lib/catalog";
import { api } from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";

interface OrderItemPreview {
  id: string;
  name: string;
  image_url?: string | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  recipient_name: string;
  created_at: string;
  order_items: OrderItemPreview[];
}

export default function OrdersPage() {
  const { user } = useAuth();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["orders", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => api<Order[]>("/orders"),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-9 w-32 animate-pulse bg-muted" />

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse border-2 border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-2 border-destructive bg-destructive/10 p-5 text-sm text-destructive">
        We couldn't load your orders. Please try again.
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={<Package className="size-6" />}
        title="No orders yet"
        description="When you send flowers, your orders will appear here."
        action={
          <Button render={<Link href="/shop" />}>
            Explore flowers
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl sm:text-3xl">
        Orders
      </h2>

      <ul className="space-y-3">
        {orders.map((order) => {
          const firstItem = order.order_items[0];

          return (
            <li
              key={order.id}
              className="border-2 border-border bg-card p-4 shadow-shadow sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {firstItem?.image_url && (
                  <Image
                    src={firstItem.image_url}
                    alt={firstItem.name}
                    width={56}
                    height={56}
                    sizes="56px"
                    className="size-14 shrink-0 object-cover"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {order.order_number}
                  </p>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()} ·{" "}
                    {order.order_items.length} item
                    {order.order_items.length > 1 ? "s" : ""} · for{" "}
                    {order.recipient_name}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
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

                  <p className="font-medium">
                    {currency(Number(order.total))}
                  </p>

                  <Button
                    render={
                      <Link href={`/account/orders/${order.id}`} />
                    }
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    View
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}