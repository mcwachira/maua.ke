import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/hero-bouquet.jpg";

import { Button } from "@/components/ui/button";
import {
  PageHeader,
  Section,
  SectionHeading,
} from "@/components/Section";

export const metadata: Metadata = {
  title: "About Maua.ke — A Kenyan Flower & Gifting Brand",
  description:
    "Maua.ke is a Nairobi-based flower and gifting service built to make sending love simple, reliable and beautiful.",
  openGraph: {
    title: "About Maua.ke",
    description:
      "Why we exist, and how we work with Kenyan growers and florists.",
    images: [
      {
        url: heroImage.src,
        alt: "A florist holding a hand-tied bouquet of blush roses",
      },
    ],
  },
};

const commitments = [
  {
    title: "Freshness",
    copy: "Stems sourced daily. If a bouquet doesn't last, tell us and we'll make it right.",
  },
  {
    title: "Reliability",
    copy: "Delivery windows we can actually hit, with tracking from preparation to doorstep.",
  },
  {
    title: "Local craft",
    copy: "Kenyan growers and Nairobi florists, paid fairly for careful work.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Flowers that say it for you"
        description="Maua means flowers in Swahili. We started Maua.ke because sending something beautiful in Kenya was harder than it should have been."
      />

      {/* Our story */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] sm:rounded-[2rem]">
            <Image
              src={heroImage}
              alt="A florist holding a hand-tied bouquet of blush roses"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-5 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              Most people who send flowers are not shopping. They are
              apologising, celebrating, grieving or saying a thing they cannot
              quite say out loud. That is what we build for.
            </p>

            <p>
              Every bouquet is hand-tied the morning it goes out. We buy from
              Kenyan growers where we can, work with independent florists in
              Nairobi, and keep our arrangements small enough that someone
              actually looks at each one before it leaves.
            </p>

            <p>
              We are honest about what we can promise: same-day across most of
              Nairobi, next-day to the major towns, and a real person on the
              other end of the phone when something goes wrong.
            </p>
          </div>
        </div>
      </Section>

      {/* Commitments */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="What we care about"
          title="Three commitments"
        />

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
          {commitments.map((commitment) => (
            <li
              key={commitment.title}
              className="flex h-full flex-col rounded-2xl border-2 border-border bg-card p-5 shadow-[2px_2px_0px_0px_var(--border)] transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--border)] sm:p-6"
            >
              <p className="font-display text-2xl leading-tight sm:text-3xl">
                {commitment.title}
              </p>

              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                {commitment.copy}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <div className="rounded-[1.5rem] border-2 border-border bloom-gradient p-6 text-center shadow-[2px_2px_0px_0px_var(--border)] sm:rounded-[2rem] sm:p-10 md:p-12">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            Send something today
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
            Choose a bouquet, add a card, pick the day. We&apos;ll do the rest.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              render={<Link href="/shop" />}
              size="lg"
              className="w-full rounded-full sm:w-auto"
            >
              Shop flowers
            </Button>

            <Button
              render={<Link href="/contact" />}
              size="lg"
              variant="neutral"
              className="w-full rounded-full sm:w-auto"
            >
              Talk to us
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}