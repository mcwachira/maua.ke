import type { Metadata } from "next";

import AddressesPageClient from "./AddressesPageClient";

export const metadata: Metadata = {
    title: "Addresses | Maua.ke",
    description: "Manage your saved delivery addresses.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AddressesPage() {
    return <AddressesPageClient />;
}