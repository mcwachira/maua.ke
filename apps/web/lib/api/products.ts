import { apiClient } from "./client";
import type {
  FlowerCategory,
  Occasion,
  Product,
} from "@/types/product";

export interface ProductFilters {
  category?: string;
  occasion?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
}

export interface PaginatedProducts {
  data: Product[];
  current_page?: number;
  last_page?: number;
  total?: number;
}

export function getProducts(
  filters: ProductFilters = {},
) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params.set(key, String(value));
      }
    },
  );

  const query = params.toString();

  return apiClient<PaginatedProducts | Product[]>(
    `/products${query ? `?${query}` : ""}`,
  );
}

export function getProduct(slug: string) {
  return apiClient<Product>(
    `/products/${encodeURIComponent(slug)}`,
  );
}

export function getOccasions() {
  return apiClient<Occasion[]>("/occasions");
}

export function getCategories() {
  return apiClient<FlowerCategory[]>("/categories");
}


// export function wishlistProducts(
//   slugs: string[],
// ): Product[] {
//   return products.filter((product) =>
//     slugs.includes(product.slug),
//   ) as Product[];
// }
