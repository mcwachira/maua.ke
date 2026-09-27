import type { CartItem, DeliveryDetails } from "./shop";

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  addOnIds: string[];
  cardId?: string;
  message?: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  delivery: DeliveryDetails;
  coupon?: string | null;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  currency: string;
  createdAt: string;
  items?: CartItem[];
}

export interface CreateOrderResponse {
  order: OrderSummary;
  payment?: {
    reference?: string;
    checkoutRequestId?: string;
    status?: string;
  };
}

export interface CheckoutPayload {
  orderId: string;
  phone: string;
  paymentMethod: "mpesa" | "card" | "bank";
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  reference?: string;
  checkoutRequestId?: string;
}
