import type { Metadata } from "next"

import CardsPageClient from "./CardsPageClient"

export const metadata: Metadata = {
  title: "Greeting Cards — Handwritten Messages | Maua.ke",
  description:
    "Choose a greeting card for birthdays, love, sympathy and more. We handwrite your message and deliver it with the flowers.",
  openGraph: {
    title: "Greeting Cards | Maua.ke",
    description: "Handwritten cards delivered with your flowers.",
  },
}

export default function CardsPage() {
  return <CardsPageClient />
}