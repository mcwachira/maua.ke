import Link from "next/link";
import { notFound } from "next/navigation";
import { getOccasion, productsByOccasion } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState, PageHeader, Section } from "@/components/Section";

export default async function OccasionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) notFound();
  const items = productsByOccasion(slug);
  return (
    <>
      <PageHeader eyebrow="Occasion" title={occasion.name} description={occasion.tagline} />
      <Section>
        {items.length === 0 ? (
          <EmptyState title="No products yet" description={`${occasion.name} has no products in demo data.`} action={<Link className="underline text-sm" href="/shop">Browse shop</Link>} />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
        <p className="mt-6 text-sm"><Link className="underline" href="/occasions">All occasions</Link></p>
      </Section>
    </>
  );
}
