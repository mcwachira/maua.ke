import type { CartItem } from "@/types/shop";

export type NewCartItem = Omit<CartItem, "key">;

export function createCartItemKey(item: NewCartItem): string {
  return [
    item.productId,
    item.variantId,
    item.cardId ?? "",
    [...item.addOnIds].sort().join("-"),
    item.message ?? "",
    item.signature ?? "",
  ].join("|");
}
