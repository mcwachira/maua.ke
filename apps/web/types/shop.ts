export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;

  variantId: string;
  variantName: string;

  unitPrice: number;
  quantity: number;

  addOnIds: string[];

  cardId?: string;
  cardName?: string;
  cardPrice?: number;

  message?: string;
  signature?: string;

  savedForLater?: boolean;
}

export interface DeliveryDetails {
  isGift: boolean;

  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;

  senderName: string;
  senderPhone: string;

  zone: string;
  address: string;
  landmark: string;
  instructions: string;

  date: string;
  slot: string;

  hidePrice: boolean;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

export interface StoredShopState {
  items: CartItem[];
  wishlist: string[];
  delivery: DeliveryDetails;
  coupon: string | null;
}