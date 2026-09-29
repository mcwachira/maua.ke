import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { blogPosts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Blog",
};

export default function AdminBlogPage() {
  return (
    <AdminPage
      title="Blog"
      description="Guides and stories published to the journal."
      action={<Button size="sm">New post</Button>}
    >
      <AdminTable
        columns={[
          "Title",
          "Category",
          "Published",
          "Read time",
          "Status",
        ]}
        rows={blogPosts.map((post) => [
          post.title,
          post.category,
          post.date,
          post.readTime,
          "Published",
        ])}
      />
    </AdminPage>
  );
}