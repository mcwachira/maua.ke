"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarHeart,
  CreditCard,
  Heart,
  Home,
  LogOut,
  MapPin,
  Package,
  Shield,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/Section";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  {
    href: "/account",
    label: "Overview",
    icon: Home,
    exact: true,
  },
  {
    href: "/account/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: Package,
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    href: "/account/recipients",
    label: "Recipients",
    icon: Users,
  },
  {
    href: "/account/reminders",
    label: "Reminders",
    icon: CalendarHeart,
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/account/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/account/payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    href: "/account/security",
    label: "Security",
    icon: Shield,
  },
] as const;

function isActivePath(
  pathname: string,
  href: string,
  exact?: boolean,
) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AccountShell({
                                       children,
                                     }: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { displayName, signOut, user } = useAuth();

  const firstName =
    displayName?.trim().split(/\s+/)[0] || "there";

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title={user ? `Hello, ${firstName}` : "Your account"}
        description="Your orders, saved people and delivery details in one place."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
          {/* Mobile / tablet navigation */}
          <div className="lg:hidden">
            <div className="overflow-x-auto pb-2">
              <nav
                aria-label="Account"
                className="flex min-w-max gap-2"
              >
                {nav.map(({ href, label, icon: Icon, exact }) => {
                  const active = isActivePath(
                    pathname,
                    href,
                    exact,
                  );

                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "inline-flex shrink-0 items-center gap-2 border-2 px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-border bg-main text-main-foreground shadow-shadow"
                          : "border-border bg-background text-muted-foreground hover:bg-secondary-background hover:text-foreground",
                      ].join(" ")}
                    >
                      <Icon className="size-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Desktop navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <nav
                aria-label="Account"
                className="space-y-1.5"
              >
                {nav.map(({ href, label, icon: Icon, exact }) => {
                  const active = isActivePath(
                    pathname,
                    href,
                    exact,
                  );

                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex items-center gap-2.5 border-2 px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "border-border bg-main text-main-foreground shadow-shadow"
                          : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary-background hover:text-foreground",
                      ].join(" ")}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>

              <Button
                variant="ghost"
                className="mt-5 w-full justify-start border-2 border-transparent text-muted-foreground hover:border-border hover:bg-secondary-background hover:text-foreground"
                onClick={() => void handleSignOut()}
              >
                <LogOut className="mr-2 size-4" />
                Sign out
              </Button>
            </div>
          </aside>

          {/* Page content */}
          <main className="min-w-0">{children}</main>
        </div>
      </Section>
    </>
  );
}