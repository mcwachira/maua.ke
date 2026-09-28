"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Heart,
  Laptop,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  occasions,
  flowerCategories,
  popularSearches,
} from "@/lib/catalog";

import { useShop } from "@/hooks/use-shop";
import { useTheme } from "@/hooks/use-theme";
import { CartDrawer } from "./CartDrawer";

/* -------------------------------------------------------------------------- */
/*                              Navigation                                    */
/* -------------------------------------------------------------------------- */

const mainNav = [
  { label: "Shop", href: "/shop" },
  { label: "Flowers", href: "/flowers" },
  { label: "Occasions", href: "/occasions" },
  { label: "Gifts", href: "/gifts" },
  { label: "Cards", href: "/cards" },
  { label: "Care Packages", href: "/care-packages" },
] as const;

/* -------------------------------------------------------------------------- */
/*                              Theme Toggle                                  */
/* -------------------------------------------------------------------------- */

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              aria-label="Change theme"
            >
              <Sun className="h-[18px] w-[18px] dark:hidden" />
              <Moon className="hidden h-[18px] w-[18px] dark:block" />
            </Button>
          }
        />

        <DropdownMenuContent
            align="end"
            className="w-40"
        >
          <DropdownMenuItem
              onClick={() => setTheme("light")}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
            {theme === "light" && (
                <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
              onClick={() => setTheme("dark")}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
            {theme === "dark" && (
                <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
              onClick={() => setTheme("system")}
          >
            <Laptop className="mr-2 h-4 w-4" />
            System
            {theme === "system" && (
                <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Search Dialog                                 */
/* -------------------------------------------------------------------------- */

function SearchDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const go = (term: string) => {
    const value = term.trim();

    if (!value) {
      return;
    }

    setOpen(false);
    setQ("");

    router.push(
        `/search?q=${encodeURIComponent(value)}`,
    );
  };

  return (
      <Sheet
          open={open}
          onOpenChange={setOpen}
      >
        <SheetTrigger
          render={
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10"
                aria-label="Search Maua.ke"
            >
              <Search className="h-[18px] w-[18px]" />
            </Button>
          }
        />

        <SheetContent
            side="top"
            className="h-auto max-h-[90vh] overflow-y-auto px-4 pb-8 sm:px-6"
        >
          <SheetHeader className="mx-auto w-full max-w-3xl">
            <SheetTitle className="font-display text-xl sm:text-2xl">
              What are you sending?
            </SheetTitle>
          </SheetHeader>

          <form
              className="mx-auto mt-4 flex w-full max-w-3xl gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                go(q);
              }}
          >
            <Input
                autoFocus
                value={q}
                onChange={(event) =>
                    setQ(event.target.value)
                }
                placeholder="Try “valentine roses” or “birthday care package”"
                aria-label="Search products"
                className="min-w-0"
            />

            <Button
                type="submit"
                className="shrink-0"
            >
              Search
            </Button>
          </form>

          <div className="mx-auto mt-4 flex w-full max-w-3xl flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-muted-foreground">
            Popular:
          </span>

            {popularSearches.map((search) => (
                <button
                    key={search}
                    type="button"
                    onClick={() => go(search)}
                    className="rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {search}
                </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Header                                    */
/* -------------------------------------------------------------------------- */

export function Header() {
  const { totals, wishlist } = useShop();

  const [menuOpen, setMenuOpen] =
      useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/85">
        {/* ------------------------------------------------------------------ */}
        {/* Announcement                                                       */}
        {/* ------------------------------------------------------------------ */}

        <div className="hidden bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground sm:block">
          Same-day delivery across Nairobi — order
          before 3:00 PM
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Main Header                                                        */}
        {/* ------------------------------------------------------------------ */}

        <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-1.5 px-3 sm:h-16 sm:gap-2 sm:px-6 lg:px-8">
          {/* Mobile Menu */}

          <Sheet
              open={menuOpen}
              onOpenChange={setMenuOpen}
          >
            <SheetTrigger
              render={
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 lg:hidden"
                    aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />

            <SheetContent
                side="left"
                className="w-[min(88vw,360px)] overflow-y-auto px-4 sm:px-6"
            >
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="font-display text-2xl">
                  <span>Maua</span>
                  <span className="text-primary">
                  .ke
                </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-5 space-y-7 pb-10">
                {/* Main navigation */}

                <ul className="space-y-1">
                  {mainNav.map((item) => (
                      <li key={item.href}>
                        <Link
                            href={item.href}
                            onClick={closeMenu}
                            className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent"
                        >
                          {item.label}
                        </Link>
                      </li>
                  ))}
                </ul>

                {/* Occasions */}

                <div>
                  <p className="eyebrow px-3 text-muted-foreground">
                    Occasions
                  </p>

                  <ul className="mt-2 space-y-1">
                    {occasions
                        .slice(0, 8)
                        .map((occasion) => (
                            <li
                                key={occasion.slug}
                            >
                              <Link
                                  href={`/occasions/${occasion.slug}`}
                                  onClick={closeMenu}
                                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                              >
                                {occasion.name}
                              </Link>
                            </li>
                        ))}
                  </ul>
                </div>

                {/* Account */}

                <div>
                  <p className="eyebrow px-3 text-muted-foreground">
                    Account
                  </p>

                  <ul className="mt-2 space-y-1">
                    <li>
                      <Link
                          href="/account"
                          onClick={closeMenu}
                          className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                      >
                        My account
                      </Link>
                    </li>

                    <li>
                      <Link
                          href="/track-order"
                          onClick={closeMenu}
                          className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                      >
                        Track an order
                      </Link>
                    </li>

                    <li>
                      <Link
                          href="/admin"
                          onClick={closeMenu}
                          className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                      >
                        Admin dashboard
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* ---------------------------------------------------------------- */}
          {/* Logo                                                             */}
          {/* ---------------------------------------------------------------- */}

          <Link
              href="/"
              aria-label="Maua.ke home"
              className="flex shrink-0 items-baseline gap-0.5"
          >
          <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            Maua
          </span>

            <span className="font-display text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            .ke
          </span>
          </Link>

          {/* ---------------------------------------------------------------- */}
          {/* Desktop Navigation                                               */}
          {/* ---------------------------------------------------------------- */}

          <nav
              className="ml-3 hidden flex-1 items-center gap-0.5 lg:flex"
              aria-label="Main navigation"
          >
            {mainNav.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground 2xl:px-3"
                >
                  {item.label}
                </Link>
            ))}
          </nav>

          {/* ---------------------------------------------------------------- */}
          {/* Actions                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="ml-auto flex items-center gap-0 sm:gap-0.5">
            <SearchDialog />

            <ThemeToggle />

            {/* Wishlist */}

            <Button
                variant="ghost"
                size="icon"
                aria-label="Wishlist"
                className="relative hidden h-9 w-9 sm:inline-flex sm:h-10 sm:w-10"
                render={<Link href="/account/wishlist" />}
              >
                <Heart className="h-[18px] w-[18px]" />

                {wishlist.length > 0 && (
                    <span
                        aria-hidden="true"
                        className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary"
                    />
                )}
              </Button>

            {/* Account */}

            <Button
                variant="ghost"
                size="icon"
                aria-label="Account"
                className="hidden h-9 w-9 sm:inline-flex sm:h-10 sm:w-10"
                render={<Link href="/account" />}
              >
                <User className="h-[18px] w-[18px]" />
              </Button>

            {/* Cart */}

            <CartDrawer>
              <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Basket, ${totals.itemCount} ${
                      totals.itemCount === 1
                          ? "item"
                          : "items"
                  }`}
                  className="relative h-9 w-9 sm:h-10 sm:w-10"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />

                {totals.itemCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-primary-foreground sm:h-5 sm:min-w-5 sm:text-[10px]">
                  {totals.itemCount > 99
                      ? "99+"
                      : totals.itemCount}
                </span>
                )}
              </Button>
            </CartDrawer>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Category Navigation                                                */}
        {/* ------------------------------------------------------------------ */}

        <div className="hidden border-t lg:block">
          <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-6 py-2 lg:px-8">
            {flowerCategories
                .slice(0, 8)
                .map((category) => (
                    <Link
                        key={category.slug}
                        href={`/flowers/${category.slug}`}
                        className="whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      {category.name}
                    </Link>
                ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Mobile Category Strip                                              */}
        {/* ------------------------------------------------------------------ */}

        <div className="hidden border-t lg:block">
          <div className="scrollbar-none mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 py-2 sm:px-6">
            {flowerCategories
                .slice(0, 8)
                .map((category) => (
                    <Link
                        key={category.slug}
                        href={`/flowers/${category.slug}`}
                        className="shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:text-xs"
                    >
                      {category.name}
                    </Link>
                ))}
          </div>
        </div>
      </header>
  );
}
