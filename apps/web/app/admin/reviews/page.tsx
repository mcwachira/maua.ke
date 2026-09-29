import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { reviews } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Reviews | Maua.ke Admin",
  description:
    "Moderate and review customer feedback on Maua.ke.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminReviewsPage() {
  return (
    <AdminPage
      title="Reviews"
      description="Customer feedback awaiting moderation or published."
    >
      <AdminTable
        columns={[
          "Product",
          "Author",
          "Rating",
          "Title",
          "Comment",
          "Date",
          "Verified",
        ]}
        rows={reviews.map((review) => [
          review.productSlug,
          review.author,
          `${review.rating} / 5`,
          review.title,
          review.comment,
          review.date,
          <Badge
            key={review.id}
            variant={
              review.verified
                ? "secondary"
                : "outline"
            }
          >
            {review.verified
              ? "Verified"
              : "Unverified"}
          </Badge>,
        ])}
      />
    </AdminPage>
  );
}