import type { Metadata } from "next";

import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
    title: "Flower Guides & Gift Ideas | Maua.ke Journal",
    description:
        "Practical flower guides, gifting ideas and care tips from the Maua.ke florists in Nairobi.",
    openGraph: {
        title: "Maua.ke Journal",
        description:
            "Flower guides, gift ideas and care tips.",
    },
};

export default function BlogPage() {
    return <BlogPageClient />;
}