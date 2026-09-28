import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarHeart,
  Flower2,
  HeartHandshake,
  Quote,
  Truck,
} from "lucide-react";

import heroImage from "@/assets/hero-bouquet.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { Section, SectionHeading } from "@/components/Section";
import {
  occasions,
  products,
  flowerCategories,
  testimonials,
  priceBands,
  currency,
} from "@/lib/catalog";

export const metadata = {
  title: "Maua.ke — Flowers That Say It For You | Nairobi Flower Delivery",
  description:
    "Send fresh flowers, gifts, greeting cards and care packages anywhere in Kenya. Same-day delivery in Nairobi, M-Pesa checkout, scheduled gifting.",
  openGraph: {
    title: "Maua.ke — Flowers That Say It For You",
    description:
      "Beautiful flowers, thoughtful gifts and heartfelt cards delivered for every occasion.",
  },
};

export default function HomePage() {
  const bestsellers = products
    .filter((p) => p.kind === "bouquet")
    .slice(0, 8);

  const packages = products
    .filter((p) => p.kind === "care-package")
    .slice(0, 4);

  return (
    <main className="w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bloom-gradient">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 md:gap-12 md:py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          {/* Hero content */}
          <div className="min-w-0">
            <Badge
              variant="neutral"
              className="rounded-full px-3 py-1 text-xs sm:text-sm"
            >
              Same-day delivery in Nairobi
            </Badge>

            <h1 className="mt-5 max-w-3xl text-4xl font-display leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Make every moment{" "}
              <span className="italic text-primary">bloom.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Beautiful flowers, thoughtful gifts and heartfelt cards
              delivered for every occasion — across Kenya.
            </p>

            {/* Hero buttons */}
<div className="mt-7 flex  flex-col sm:mx-auto gap-3 sm:flex-row sm:mt-8 w-1/2 sm:w-full flex-wrap sm:flex-nowrap">
               <Button
                 size="lg"
                 className=" rounded-full px-7 sm:w-auto"
                 render={<Link href="/shop" />}
               >
                 Shop flowers
               </Button>

               <Button
                 size="lg"
                 variant="neutral"
                 className=" rounded-full px-7 sm:w-auto"
                 render={<Link href="/occasions" />}
               >
                 Explore occasions
               </Button>
             </div>

            {/* Stats */}
            <dl className="mt-9 grid grid-cols-3 gap-3 sm:mt-10 sm:max-w-lg sm:gap-5">
              <div className="min-w-0">
                <dt className="font-display text-xl text-primary sm:text-2xl">
                  3 hrs
                </dt>
                <dd className="mt-1 text-xs leading-tight text-muted-foreground sm:text-sm">
                  Nairobi delivery
                </dd>
              </div>

              <div className="min-w-0">
                <dt className="font-display text-xl text-primary sm:text-2xl">
                  M-Pesa
                </dt>
                <dd className="mt-1 text-xs leading-tight text-muted-foreground sm:text-sm">
                  Pay your way
                </dd>
              </div>

              <div className="min-w-0">
                <dt className="font-display text-xl text-primary sm:text-2xl">
                  7 days
                </dt>
                <dd className="mt-1 text-xs leading-tight text-muted-foreground sm:text-sm">
                  Freshness promise
                </dd>
              </div>
            </dl>
          </div>

          {/* Hero image */}
          <div className="relative min-w-0">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-[1.5rem] shadow-lift sm:rounded-[2rem] md:aspect-[5/4] lg:aspect-[7/6]">
              <Image
                src={heroImage}
                alt="Hand-tied bouquet of blush roses and ranunculus wrapped in cream paper"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Delivery badge */}
            <div className="absolute -bottom-4 left-4 right-4 hidden rounded-2xl border bg-card p-4 shadow-soft sm:block sm:max-w-xs md:-bottom-5 md:left-5">
              <p className="text-xs text-muted-foreground">
                Delivered this morning
              </p>

              <p className="mt-1 font-display text-base sm:text-lg">
                Kilimani, Nairobi · 10:42 AM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <Section className="py-8 sm:py-10 md:py-12">
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {[
            {
              icon: Flower2,
              title: "Florist-made daily",
              copy: "Hand-tied each morning from market-fresh stems.",
            },
            {
              icon: Truck,
              title: "Scheduled delivery",
              copy: "Pick the date, pick the window, we handle the rest.",
            },
            {
              icon: HeartHandshake,
              title: "Gifting built in",
              copy: "Cards, messages and hidden prices as standard.",
            },
            {
              icon: CalendarHeart,
              title: "Never forget",
              copy: "Save recipients and set birthday reminders.",
            },
          ].map(({ icon: Icon, title, copy }) => (
            <li
              key={title}
              className="rounded-2xl border bg-card p-5 sm:p-6"
            >
              <Icon className="h-6 w-6 text-primary" />

              <p className="mt-3 font-medium">{title}</p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {copy}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Occasions */}
      <Section>
        <SectionHeading
          eyebrow="Shop by occasion"
          title="What are you celebrating?"
          description="Every bouquet on Maua.ke is tagged to the moment it was made for."
action={
             <Button
               variant="ghost"
               className="mt-2 rounded-full sm:mt-0"
               render={<Link href="/occasions" />}
             >
               All occasions
               <ArrowRight className="ml-1.5 h-4 w-4" />
             </Button>
           }
        />

        <ul className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {occasions.slice(0, 8).map((o) => (
            <li key={o.slug}>
              <Link
                href={`/occasions/${o.slug}`}
                className="group flex min-h-[120px] h-full flex-col justify-between rounded-2xl border bg-card p-5 transition-shadow hover:shadow-soft sm:min-h-[140px]"
              >
                <span className="font-display text-lg leading-tight group-hover:text-primary sm:text-xl">
                  {o.name}
                </span>

                <span className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {o.tagline}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Bestsellers */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Loved by our customers"
          title="Bestselling bouquets"
action={
             <Button
               variant="ghost"
               className="mt-2 rounded-full sm:mt-0"
               render={<Link href="/shop" />}
             >
               Shop all
               <ArrowRight className="ml-1.5 h-4 w-4" />
             </Button>
           }
        />

        <div className="grid grid-cols-1 gap-5 min-[400px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Price bands */}
      <section className="petal-gradient">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <SectionHeading
            eyebrow="Shop by price"
            title="Something beautiful at every budget"
          />

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {priceBands.map((band) => (
              <li key={band.slug}>
                <Link
                  href={`/shop?price=${encodeURIComponent(band.slug)}`}
                  className="flex min-h-[90px] items-center justify-center rounded-2xl border bg-card px-4 py-5 text-center transition-shadow hover:shadow-soft sm:min-h-[110px] sm:py-6"
                >
                  <span className="font-display text-base leading-tight sm:text-lg">
                    {band.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Care packages */}
      <Section>
        <SectionHeading
          eyebrow="Care packages"
          title="More than flowers"
          description="Curated boxes that pair blooms with chocolate, candles, tea and a handwritten card."
action={
             <Button
               variant="ghost"
               className="mt-2 rounded-full sm:mt-0"
               render={<Link href="/care-packages" />}
             >
               All packages
               <ArrowRight className="ml-1.5 h-4 w-4" />
             </Button>
           }
        />

        <div className="grid grid-cols-1 gap-5 min-[400px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {packages.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Flower categories */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Shop by flower"
          title="Browse the flower market"
        />

        <ul className="flex flex-wrap gap-2">
          {flowerCategories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/flowers/${c.slug}`}
                className="inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Testimonials */}
      <section className="border-y bg-cream">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <SectionHeading
            eyebrow="Demo reviews"
            title="Loved by our customers"
            description="Sample testimonials shown while the store is in development."
          />

          <ul className="grid gap-5 md:grid-cols-3 md:gap-6">
            {testimonials.map((t) => (
              <li
                key={t.name}
                className="rounded-2xl border bg-card p-5 sm:p-6"
              >
                <Quote className="h-6 w-6 text-primary" />

                <p className="mt-3 font-display text-lg leading-snug sm:text-xl">
                  “{t.quote}”
                </p>

                <p className="mt-4 text-sm text-muted-foreground">
                  {t.name} · {t.location}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <Section>
        <div className="grid items-center gap-7 rounded-[1.5rem] border bloom-gradient p-6 sm:rounded-[2rem] sm:p-8 md:gap-8 md:p-12 lg:grid-cols-2">
          <div className="min-w-0">
            <p className="eyebrow text-primary">
              Send love. Send Maua.
            </p>

            <h2 className="mt-2 text-3xl leading-tight sm:text-4xl">
              Choose the moment. We'll handle the flowers.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Pick a bouquet, add a card and message, choose when it
              arrives, and pay with M-Pesa. Bouquets from{" "}
              {currency(2900)}.
            </p>
          </div>

<div className="flex w-full flex-col gap-3 sm:flex-row lg:justify-end">
             <Button
               size="lg"
               className="w-full rounded-full px-7 sm:w-auto"
               render={<Link href="/shop" />}
             >
               Start an order
             </Button>

             <Button
               size="lg"
               variant="neutral"
               className="w-full rounded-full px-7 sm:w-auto"
               render={<Link href="/track-order" />}
             >
               Track an order
             </Button>
           </div>
        </div>
      </Section>
    </main>
  );
}

