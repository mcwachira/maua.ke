import type { Metadata } from "next";

import AdminSettingsClient from "./AdminSettingsClient";

export const metadata: Metadata = {
  title: "Settings | Maua.ke Admin",
  description:
    "Manage Maua.ke store, commerce, payment and notification settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}