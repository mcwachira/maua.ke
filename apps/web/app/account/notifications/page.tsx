"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/Section";
import { demoNotifications } from "@/lib/demo-account";

export default function NotificationsPage() {
  const [items, setItems] = useState(demoNotifications);

  const markAllRead = () => {
    setItems((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );

    toast.success("All caught up");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl sm:text-3xl">
          Notifications
        </h2>

        <Button
          variant="ghost"
          size="sm"
          className="self-start sm:self-auto"
          onClick={markAllRead}
        >
          Mark all as read
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-6" />}
          title="Nothing new"
          description="Order updates and reminders will land here."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((notification) => (
            <li
              key={notification.id}
              className={[
                "border-2 border-border bg-card p-4 shadow-shadow sm:p-5",
                notification.unread
                  ? "bg-secondary-background"
                  : "",
              ].join(" ")}
            >
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  <span>{notification.title}</span>

                  {notification.unread && (
                    <Badge variant="secondary">
                      New
                    </Badge>
                  )}
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {notification.body}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  {notification.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}