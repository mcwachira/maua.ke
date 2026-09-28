import { notFound } from "next/navigation"

import { currency, getProduct } from "@/lib/catalog"

import ProductPageClient from "./ProductPageClient"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: ProductPageProps) {
  const { slug } = await params

  const product = getProduct(slug)

  if (!product) {
    return {
      title: "Product unavailable | Maua.ke",
      robots: {
        index: false,
      },
    }
  }

  const description =
    product.description.slice(0, 155)

  return {
    title: `${product.name} — ${currency(product.price)} | Maua.ke`,
    description,
    openGraph: {
      title: `${product.name} | Maua.ke`,
      description,
      images: product.image
        ? [
            {
              url: product.image,
              alt: product.name,
            },
          ]
        : undefined,
    },
  }
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params

  const product = getProduct(slug)

  if (!product) {
    notFound()
  }

  return <ProductPageClient product={product} />
}
