import type { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
    title: "Sign in | Maua.ke",
    description:
        "Sign in to your Maua.ke account to track orders and saved recipients.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Sign in | Maua.ke",
        description: "Access your orders, wishlist and reminders.",
    },
};

export default function LoginPage() {
    return <LoginPageClient />;
}