import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Maua.ke — Nairobi Flower Delivery Support",
  description:
    "Call, WhatsApp or email the Maua.ke team about orders, deliveries and custom arrangements.",
  openGraph: {
    title: "Contact Maua.ke",
    description:
      "Support for orders, deliveries and custom arrangements.",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}