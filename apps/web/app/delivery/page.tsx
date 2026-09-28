import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import {
  currency,
  deliverySlots,
  deliveryZones,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Delivery Policy & Zones | Maua.ke",
  description:
    "Maua.ke delivery zones, fees, cut-off times and time windows for Nairobi, Mombasa, Kisumu and beyond.",
  openGraph: {
    title: "Delivery Policy | Maua.ke",
    description:
      "Zones, fees, cut-offs and delivery windows across Kenya.",
  },
};

export default function DeliveryPage() {
  return (
    <LegalPage
      eyebrow="Policy"
      title="Delivery"
      updated="26 August 2026"
      intro="Where we deliver, what it costs, and when your flowers will arrive."
      sections={[
        {
          heading: "Delivery zones and fees",
          paragraphs: [
            deliveryZones
              .map(
                (zone) =>
                  `${zone.name} — ${currency(zone.fee)}${
                    zone.sameDay
                      ? `, same-day before ${zone.cutoff}`
                      : ", next-day"
                  }`,
              )
              .join(". ") + ".",
            "Zones and fees are configurable and may change as we add new areas.",
          ],
        },
        {
          heading: "Delivery windows",
          paragraphs: [
            deliverySlots
              .map((slot) => `${slot.label}: ${slot.window}`)
              .join(" · ") + ".",
            "You choose your window at checkout. We call the recipient shortly before arrival unless you ask us not to.",
          ],
        },
        {
          heading: "Same-day delivery",
          paragraphs: [
            "Same-day is available in Nairobi and Kiambu for orders placed before the cut-off shown for your area. Orders after the cut-off move to the next available slot.",
          ],
        },
        {
          heading: "Failed deliveries",
          paragraphs: [
            "If nobody is available, our rider calls the recipient and then the sender. We can leave the flowers with a neighbour or a reception desk when your instructions allow it. A second attempt may attract an additional delivery fee.",
          ],
        },
      ]}
    />
  );
}