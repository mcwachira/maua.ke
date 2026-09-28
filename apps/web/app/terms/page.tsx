import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "terms & Conditions | Maua.ke",
  description:
    "The terms that apply when you order flowers and gifts from Maua.ke.",
  openGraph: {
    title: "terms & Conditions | Maua.ke",
    description:
      "The terms that apply to orders placed on Maua.ke.",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & conditions"
      updated="26 August 2026"
      intro="These terms apply whenever you place an order on Maua.ke."
      sections={[
        {
          heading: "Orders",
          paragraphs: [
            "An order is confirmed only once payment has been verified on our servers. Prices, discounts and delivery fees are calculated server-side and displayed in Kenyan shillings.",
          ],
        },
        {
          heading: "Accounts",
          paragraphs: [
            "You are responsible for keeping your login details secure. Tell us immediately if you believe someone else has access to your account.",
          ],
        },
        {
          heading: "Product images",
          paragraphs: [
            "Photographs are representative. Stem counts and arrangement styles match the product description; exact blooms vary with the season.",
          ],
        },
        {
          heading: "Liability",
          paragraphs: [
            "Where a delivery fails because of information you supplied, or circumstances outside our control, our liability is limited to the value of the order.",
          ],
        },
        {
          heading: "Changes",
          paragraphs: [
            "We may update these terms. The version shown here, with its last-updated date, is the one that applies to new orders.",
          ],
        },
      ]}
    />
  );
}