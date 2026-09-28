import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy & Cookie Policy | Maua.ke",
  description:
    "What personal information Maua.ke collects, how we use it, and the choices you have.",
  openGraph: {
    title: "Privacy Policy | Maua.ke",
    description: "How we handle your data and cookies.",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy & cookies"
      updated="26 August 2026"
      intro="We collect the minimum we need to deliver flowers and keep your account secure."
      sections={[
        {
          heading: "What we collect",
          paragraphs: [
            "Account details (name, email, phone), delivery details for you and your recipients, order and payment records, and basic analytics about how the site is used.",
          ],
        },
        {
          heading: "How we use it",
          paragraphs: [
            "To process and deliver orders, to contact you and the recipient about a delivery, to prevent fraud, and — only if you opt in — to send reminders and offers.",
          ],
        },
        {
          heading: "Sharing",
          paragraphs: [
            "We share the minimum necessary with delivery riders, payment providers and messaging providers. We do not sell personal data.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "We use cookies and local storage to keep your basket, theme preference and session. Analytics cookies are used to understand which pages help people find the right gift.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "You can update or delete your account details from your account settings, or contact us and we will handle the request.",
          ],
        },
      ]}
    />
  );
}