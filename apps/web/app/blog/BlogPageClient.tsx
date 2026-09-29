"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/Section";
import { blogPosts } from "@/lib/catalog";

export default function BlogPageClient() {
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(blogPosts.map((post) => post.category)),
      ),
    ],
    [],
  );

  const [active, setActive] = useState("All");

  const posts =
    active === "All"
      ? blogPosts
      : blogPosts.filter(
        (post) => post.category === active,
      );

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Inspiration & flower guides"
        description="What to send, when to send it, and how to make it last."
      />

      <Section>
        <div className="mb-6 sm:mb-8">
          <div
            className="flex gap-2 overflow-x-auto pb-2"
            aria-label="Filter articles by category"
          >
            {categories.map((category) => {
              const isActive = active === category;

              return (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={
                    isActive
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setActive(category)
                  }
                  aria-pressed={isActive}
                  className="shrink-0 rounded-full"
                >
                  {category}
                </Button>
              );
            })}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="border-2 border-border bg-card p-8 text-center shadow-shadow sm:p-12">
            <h2 className="font-display text-2xl font-semibold">
              No articles found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Try another category.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={() => setActive("All")}
            >
              View all articles
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col border-2 border-border bg-card p-5 shadow-shadow transition-transform hover:-translate-y-0.5 hover:shadow-none sm:p-6"
                >
                  <Badge
                    variant="secondary"
                    className="w-fit"
                  >
                    {post.category}
                  </Badge>

                  <h2 className="mt-3 font-display text-xl font-semibold leading-tight sm:text-2xl">
                    {post.title}
                  </h2>

                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground sm:text-base">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t-2 border-border pt-4 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <span className="mt-4 text-sm font-semibold text-primary">
                    Read article →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}