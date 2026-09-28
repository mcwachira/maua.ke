import type { Metadata } from "next";

import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { greetingCards, currency } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Cards",
};

export default function AdminCardsPage() {
  return (
    <AdminPage
      title="Cards"
      description="Greeting cards available across the Maua.ke store."
    >
      <AdminTable
        columns={[
          "Card",
          "Category",
          "Price",
          "Preview",
        ]}
        rows={greetingCards.map((card) => [
          card.name,
          card.category,
          currency(card.price),
          card.preview,
        ])}
      />
    </AdminPage>
  );
}