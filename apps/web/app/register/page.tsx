import type { Metadata } from "next";
import RegisterPageClient from "./RegisterPageClient";

export const metadata: Metadata = {
  title: "Create your account | Maua.ke",
  description:
    "Create a Maua.ke account to save recipients, set reminders and reorder quickly.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Create your account | Maua.ke",
    description:
      "Save recipients, set reminders and reorder quickly.",
  },
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}