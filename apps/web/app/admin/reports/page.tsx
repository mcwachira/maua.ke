import type { Metadata } from "next";

import AdminReports from "./AdminReports";

export const metadata: Metadata = {
  title: "Reports | Maua.ke Admin",
  description:
    "Maua.ke revenue, order and demand reports.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReportsPage() {
  return <AdminReports />;
}