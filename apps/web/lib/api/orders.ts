import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderSummary,
} from "@/types/order";
import { apiClient } from "./client";

export function createOrder(
  payload: CreateOrderPayload,
) {
  return apiClient<CreateOrderResponse>(
    "/orders",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getOrder(orderNumber: string) {
  return apiClient<OrderSummary>(
    `/orders/${encodeURIComponent(orderNumber)}`,
  );
}
