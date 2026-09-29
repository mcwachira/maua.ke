import type { Metadata } from "next";

import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Maua.ke",
  description:
    "Maua.ke operations dashboard for orders, products, delivery and campaigns.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}