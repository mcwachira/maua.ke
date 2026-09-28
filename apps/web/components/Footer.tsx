"use client";


import { Phone, Mail } from "lucide-react";
import { FaInstagram,FaFacebookF } from "react-icons/fa6";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link"

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Flowers", href: "/flowers" },
      { label: "All bouquets", href: "/shop" },
      { label: "Roses", href: "/shop?category=red-roses" },
      { label: "Gifts", href: "/gifts" },
      { label: "Cards", href: "/cards" },
      { label: "Care Packages", href: "/care-packages" },
    ],
  },
  {
    title: "Occasions",
    links: [
      { label: "Valentine's", href: "/occasions/valentines" },
      { label: "Birthdays", href: "/occasions/birthday" },
      { label: "Anniversaries", href: "/occasions/anniversary" },
      { label: "Mother's Day", href: "/occasions/mothers-day" },
      { label: "Father's Day", href: "/occasions/fathers-day" },
      { label: "Sympathy", href: "/occasions/sympathy" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Delivery", href: "/delivery" },
      { label: "Returns & refunds", href: "/returns" },
      { label: "Track order", href: "/track-order" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy", href: "/privacy" },
      { label: "terms", href: "/terms" },
    ],
  },
] as const;

export function Footer() {
  const handleNewsletterSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    toast.success(
      "You're on the list. Look out for seasonal drops.",
    );

    event.currentTarget.reset();
  };

  return (
    <footer className="mt-16 border-t bg-cream sm:mt-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-8">
          {/* Brand / Newsletter */}
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block font-display text-3xl"
            >
              Maua<span className="text-primary">.ke</span>
            </Link>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Flowers that say it for you. Hand-tied in Nairobi and
              delivered across Kenya.
            </p>

            {/* Newsletter */}
            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-5 flex w-full gap-2"
            >
              <Input
                type="email"
                required
                placeholder="Your email"
                aria-label="Email for updates"
                className="min-w-0 flex-1"
              />

              <Button variant={"noShadow"} type="submit" className="shrink-0">
                Join
              </Button>
            </form>

            {/* Social links */}
            <div className="mt-5 flex gap-2">
              <Button
                variant="noShadow"
                size="icon"
                aria-label="Instagram"
                render={<a href="https://instagram.com" target="_blank" rel="noreferrer" />}
              >
                <FaInstagram className="h-4 w-4" />
              </Button>

              <Button
                variant="noShadow"
                size="icon"
                aria-label="Facebook"
                render={<a href="https://facebook.com" target="_blank" rel="noreferrer" />}
              >
                <FaFacebookF className="h-4 w-4" />
              </Button>

              <Button
                variant="noShadow"
                size="icon"
                aria-label="Call us"
                render={<a href="tel:+254700000000" />}
              >
                <Phone className="h-4 w-4" />
              </Button>

              <Button
                variant="noShadow"
                size="icon"
                aria-label="Email us"
                render={<a href="mailto:hello@maua.ke" />}
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Footer columns */}
          {columns.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
            >
              <p className="eyebrow text-muted-foreground">
                {column.title}
              </p>

              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom footer */}
        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Maua.ke — Nairobi, Kenya.
            Demo storefront with sample data.
          </p>

          <p>
            M-Pesa and card payments · Prices in KES
          </p>
        </div>
      </div>
    </footer>
  );
}