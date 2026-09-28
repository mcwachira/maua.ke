import type { Metadata } from "next";
import AccountShell from "./AccountShell";

export const metadata: Metadata = {
  title: "Your Account | Maua.ke",
  description:
    "Manage your Maua.ke orders, recipients, reminders and preferences.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Your Account | Maua.ke",
    description: "Orders, recipients, reminders and preferences.",
  },
};

export default function AccountLayout({
                                        children,
                                      }: {
  children: React.ReactNode;
}) {
  return <AccountShell>{children}</AccountShell>;
}