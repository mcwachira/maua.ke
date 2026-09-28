import type { Metadata } from "next";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/Section";

const faqs: {
  category: string;
  items: { q: string; a: string }[];
}[] = [
  {
    category: "Orders",
    items: [
      {
        q: "How do I place an order?",
        a: "Choose a bouquet, pick a size, add a card and message, then choose your delivery date and area at checkout. You can order as a guest or from an account.",
      },
      {
        q: "Can I change my order after paying?",
        a: "Contact us as soon as possible. If the bouquet hasn't been prepared yet we can usually change the recipient, message or delivery date.",
      },
      {
        q: "Can I cancel an order?",
        a: "Yes, up until the bouquet enters preparation. After that we can offer a partial refund or a credit.",
      },
    ],
  },
  {
    category: "Delivery",
    items: [
      {
        q: "Do you deliver same-day?",
        a: "Yes, across most of Nairobi for orders placed before the cut-off shown for your area — typically 3:00 PM for CBD and Westlands.",
      },
      {
        q: "Which towns do you deliver to?",
        a: "Nairobi, Kiambu, Machakos, Mombasa, Kisumu, Nakuru and Eldoret, with more zones being added.",
      },
      {
        q: "What if nobody is home?",
        a: "Our rider calls the recipient, then the sender. We can leave the flowers with a neighbour or reception if you allow it in your delivery instructions.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "How do I pay with M-Pesa?",
        a: "Choose M-Pesa at checkout and enter your number. You'll get an STK push prompt on your phone — enter your PIN to confirm.",
      },
      {
        q: "Do you accept cards?",
        a: "Yes, Visa and Mastercard are supported at checkout.",
      },
      {
        q: "When am I charged?",
        a: "At checkout. Payment is verified on our servers before an order is confirmed.",
      },
    ],
  },
  {
    category: "Cards & messages",
    items: [
      {
        q: "Do you handwrite the message?",
        a: "Yes. Your message is written onto the card you choose before the bouquet is packed.",
      },
      {
        q: "Can I hide the price from the recipient?",
        a: "Yes — when you mark an order as a gift, prices are removed from everything the recipient sees.",
      },
    ],
  },
  {
    category: "Flowers & care",
    items: [
      {
        q: "How long will my flowers last?",
        a: "Most bouquets last five to seven days with fresh water and a trim every couple of days.",
      },
      {
        q: "Will my bouquet look exactly like the photo?",
        a: "Very close. Seasonal availability means our florists occasionally substitute a similar stem of equal or greater value.",
      },
    ],
  },
  {
    category: "Returns & refunds",
    items: [
      {
        q: "What if the flowers arrive damaged?",
        a: "Send us a photo within 24 hours and we'll replace the bouquet or refund you.",
      },
      {
        q: "How long do refunds take?",
        a: "M-Pesa refunds usually land within 24 hours; card refunds can take up to seven working days.",
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "FAQ — Delivery, M-Pesa Payments & Flower Care | Maua.ke",
  description:
    "Answers about ordering, same-day delivery, M-Pesa payments, greeting cards, refunds and flower care.",
  openGraph: {
    title: "Frequently Asked Questions | Maua.ke",
    description:
      "Delivery, payments, cards, refunds and flower care.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  ),
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Frequently asked questions"
        description="Everything about ordering, delivery, payment and flower care."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-10">
          {/* FAQ content */}
          <div className="min-w-0 space-y-8 sm:space-y-10">
            {faqs.map((group) => (
              <section key={group.category}>
                <h2 className="mb-3 font-display text-2xl leading-tight sm:text-3xl">
                  {group.category}
                </h2>

                <Accordion
                  className="overflow-hidden rounded-2xl border-2 border-border bg-card px-4 shadow-[2px_2px_0px_0px_var(--border)] sm:px-5"
                >
                  {group.items.map((item, index) => (
                    <AccordionItem
                      key={item.q}
                      value={`${group.category}-${index}`}
                    >
                      <AccordionTrigger className="py-4 bg-none border-none text-left text-sm leading-6 sm:py-5 sm:text-base ">
                        {item.q}
                      </AccordionTrigger>

                      <AccordionContent className="pb-4 text-sm leading-6 text-muted-foreground sm:pb-5 sm:text-base">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>

          {/* Support card */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-2xl border-2 border-border bloom-gradient p-5 shadow-[2px_2px_0px_0px_var(--border)] sm:p-6">
              <p className="font-display text-xl sm:text-2xl">
                Still stuck?
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Our team answers within a few hours, every day.
              </p>

              <Button
                render={<Link href="/contact" />}
                className="mt-4 w-full"
              >
                Contact support
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    </>
  );
}