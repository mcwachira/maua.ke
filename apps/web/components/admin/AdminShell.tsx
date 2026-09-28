"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  CalendarRange,
  ClipboardList,
  CreditCard,
  Flower2,
  Gift,
  Home,
  LifeBuoy,
  MapPin,
  Megaphone,
  Newspaper,
  Package,
  PercentCircle,
  ScrollText,
  Settings,
  ShoppingCart,
  Star,
  Tags,
  Truck,
  Users,
  Wallet,
  X,
  Menu,
} from "lucide-react";
import type {
  ComponentType,
  ReactNode,
} from "react";
import { useState } from "react";

import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

const groups: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: Home,
        exact: true,
      },
      {
        href: "/admin/reports",
        label: "Reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Commerce",
    items: [
      {
        href: "/admin/orders",
        label: "Orders",
        icon: ShoppingCart,
      },
      {
        href: "/admin/products",
        label: "Products",
        icon: Package,
      },
      {
        href: "/admin/categories",
        label: "Categories",
        icon: Tags,
      },
      {
        href: "/admin/occasions",
        label: "Occasions",
        icon: CalendarRange,
      },
      {
        href: "/admin/flowers",
        label: "Flowers",
        icon: Flower2,
      },
      {
        href: "/admin/cards",
        label: "Cards",
        icon: Newspaper,
      },
      {
        href: "/admin/care-packages",
        label: "Care packages",
        icon: Gift,
      },
      {
        href: "/admin/add-ons",
        label: "Add-ons",
        icon: Boxes,
      },
      {
        href: "/admin/inventory",
        label: "Inventory",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Customers",
    items: [
      {
        href: "/admin/customers",
        label: "Customers",
        icon: Users,
      },
      {
        href: "/admin/recipients",
        label: "Recipients",
        icon: Users,
      },
      {
        href: "/admin/reviews",
        label: "Reviews",
        icon: Star,
      },
      {
        href: "/admin/support",
        label: "Support",
        icon: LifeBuoy,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        href: "/admin/deliveries",
        label: "Deliveries",
        icon: Truck,
      },
      {
        href: "/admin/delivery-zones",
        label: "Delivery zones",
        icon: MapPin,
      },
      {
        href: "/admin/payments",
        label: "Payments",
        icon: CreditCard,
      },
      {
        href: "/admin/promotions",
        label: "Promotions",
        icon: PercentCircle,
      },
      {
        href: "/admin/campaigns",
        label: "Campaigns",
        icon: Megaphone,
      },
      {
        href: "/admin/blog",
        label: "Blog",
        icon: Newspaper,
      },
      {
        href: "/admin/audit-logs",
        label: "Audit logs",
        icon: ScrollText,
      },
      {
        href: "/admin/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];

function isItemActive(
  pathname: string,
  item: AdminNavItem,
) {
  if (item.exact) {
    return pathname === item.href;
  }

  return (
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`)
  );
}

function AdminNavigation({
                           pathname,
                           onNavigate,
                         }: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Admin navigation" className="space-y-5">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {group.title}
          </p>

          <ul className="mt-1.5 space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(
                pathname,
                item,
              );

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      active ? "page" : undefined
                    }
                    onClick={onNavigate}
                    className={cn(
                      "flex min-h-10 items-center gap-2 border-2 px-3 py-2 text-sm transition-all",
                      active
                        ? "border-border bg-accent font-medium text-foreground shadow-shadow"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function AdminBrand() {
  return (
    <div>
      <p className="eyebrow text-primary">
        Maua.ke admin
      </p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Demo data — read-only preview
      </p>
    </div>
  );
}

function AdminPayoutNotice() {
  return (
    <div className="mt-6 flex items-start gap-2 border-2 border-border bg-card p-3 text-xs leading-5 text-muted-foreground shadow-shadow">
      <Wallet className="mt-0.5 size-4 shrink-0 text-primary" />

      <span>
        Payouts settle every Monday
      </span>
    </div>
  );
}

export default function AdminShell({
                                     children,
                                   }: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <Section className="py-4 sm:py-6 lg:py-8">
      {/* Mobile admin header */}
      <div className="mb-4 flex items-center justify-between gap-3 border-2 border-border bg-card p-3 shadow-shadow lg:hidden">
        <div className="min-w-0">
          <p className="eyebrow text-primary">
            Maua.ke admin
          </p>

          <p className="truncate text-xs text-muted-foreground">
            Demo data — read-only preview
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={
            mobileOpen
              ? "Close admin navigation"
              : "Open admin navigation"
          }
          aria-expanded={mobileOpen}
          onClick={() =>
            setMobileOpen((open) => !open)
          }
        >
          {mobileOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="mb-6 border-2 border-border bg-card p-4 shadow-shadow lg:hidden">
          <AdminNavigation
            pathname={pathname}
            onNavigate={() =>
              setMobileOpen(false)
            }
          />

          <AdminPayoutNotice />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:sticky lg:top-28 lg:block lg:h-fit">
          <AdminBrand />

          <div className="mt-5">
            <AdminNavigation pathname={pathname} />
          </div>

          <AdminPayoutNotice />
        </aside>

        {/* Page content */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </Section>
  );
}

interface AdminPageProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function AdminPage({
                            title,
                            description,
                            action,
                            children,
                          }: AdminPageProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 border-b-2 border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </header>

      {children}
    </div>
  );
}

interface AdminStatProps {
  label: string;
  value: string;
  hint?: string;
}

export function AdminStat({
                            label,
                            value,
                            hint,
                          }: AdminStatProps) {
  return (
    <div className="min-w-0 border-2 border-border bg-card p-4 shadow-shadow sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 break-words font-display text-2xl sm:text-3xl">
        {value}
      </p>

      {hint && (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

interface AdminTableProps {
  columns: string[];
  rows: ReactNode[][];
}

export function AdminTable({
                             columns,
                             rows,
                           }: AdminTableProps) {
  return (
    <div className="overflow-hidden border-2 border-border bg-card shadow-shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
          <tr className="border-b-2 border-border bg-muted/50">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                {column}
              </th>
            ))}
          </tr>
          </thead>

          <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-muted-foreground"
              >
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-border last:border-b-0 hover:bg-muted/30"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3.5 align-middle"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}