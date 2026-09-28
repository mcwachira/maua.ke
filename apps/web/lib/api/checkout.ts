import type {
  CheckoutPayload,
  CheckoutResponse,
} from "@/types/order";
import { apiClient } from "./client";

export function initiateCheckout(
  payload: CheckoutPayload,
) {
  return apiClient<CheckoutResponse>(
    "/checkout",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getCheckoutStatus(
  reference: string,
) {
  return apiClient<CheckoutResponse>(
    `/checkout/${encodeURIComponent(reference)}`,
  );
}
