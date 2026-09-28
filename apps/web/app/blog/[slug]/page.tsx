import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { blogPosts } from "@/lib/catalog";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
                                         params,
                                       }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = blogPosts.find(
    (item) => item.slug === slug,
  );

  if (!post) {
    return {
      title: "Article not found | Maua.ke",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${post.title} | Maua.ke Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
                                             params,
                                           }: BlogPostPageProps) {
  const { slug } = await params;

  const post = blogPosts.find(
    (item) => item.slug === slug,
  );

  if (!post) {
    notFound();
  }

  const more = blogPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <header className="border-b-2 border-border bloom-gradient">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <Badge variant="secondary">
            {post.category}
          </Badge>

          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {post.date}
            <span aria-hidden="true"> · </span>
            {post.readTime}
          </p>
        </div>
      </header>

      <Section className="max-w-3xl">
        <article className="space-y-5 text-base leading-8 text-muted-foreground sm:space-y-6 sm:text-lg sm:leading-relaxed">
          {post.body.map((paragraph, index) => (
            <p key={`${post.slug}-${index}`}>
              {paragraph}
            </p>
          ))}
        </article>

        <div className="mt-8 border-2 border-border bloom-gradient p-5 shadow-shadow sm:mt-10 sm:p-6">
          <p className="font-display text-2xl font-semibold sm:text-3xl">
            Ready to send something?
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Find a thoughtful bouquet or gift for someone special.
          </p>

          <Button
            render={<Link href="/shop" />}
            className="mt-4 w-full sm:w-auto"
          >
            Shop flowers
          </Button>
        </div>

        {more.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <h2 className="mb-4 font-display text-2xl font-semibold sm:text-3xl">
              Keep reading
            </h2>

            <ul className="grid gap-4 sm:grid-cols-3">
              {more.map((relatedPost) => (
                <li key={relatedPost.slug}>
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="block h-full border-2 border-border bg-card p-4 shadow-shadow transition-transform hover:-translate-y-0.5 hover:shadow-none sm:p-5"
                  >
                    <Badge
                      variant="secondary"
                      className="mb-3"
                    >
                      {relatedPost.category}
                    </Badge>

                    <span className="block font-display text-lg font-semibold leading-tight">
                      {relatedPost.title}
                    </span>

                    <span className="mt-3 block text-sm font-medium text-primary">
                      Read article →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>
    </>
  );
}