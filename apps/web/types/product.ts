export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  available?: boolean;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
  image?: string;
  available?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  image: string;
  images?: string[];
  price?: number;
  category?: string;
  categorySlug?: string;
  occasionSlugs?: string[];
  variants?: ProductVariant[];
  featured?: boolean;
  available?: boolean;
  [key: string]: unknown;
}

export interface FlowerCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  [key: string]: unknown;
}

export interface Occasion {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  [key: string]: unknown;
}
