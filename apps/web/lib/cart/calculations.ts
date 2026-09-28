import {
  addOns as allAddOns,
  deliveryZones,
} from "@/lib/catalog";
import { COUPONS } from "@/lib/coupons";
import type { CartItem, CartTotals } from "@/types/shop";

export function calculateCartTotals(
  items: CartItem[],
  deliveryZone: string,
  coupon: string | null,
): CartTotals {
  const activeItems = items.filter(
    (item) => !item.savedForLater,
  );

  const subtotal = activeItems.reduce((sum, item) => {
    const addOnTotal = item.addOnIds.reduce(
      (addOnSum, addOnId) =>
        addOnSum +
        (allAddOns.find(
          (addOn) => addOn.id === addOnId,
        )?.price ?? 0),
      0,
    );

    const itemTotal =
      item.unitPrice +
      addOnTotal +
      (item.cardPrice ?? 0);

    return sum + itemTotal * item.quantity;
  }, 0);

  const zone = deliveryZones.find(
    (item) => item.slug === deliveryZone,
  );

  let deliveryFee = activeItems.length
    ? (zone?.fee ?? 0)
    : 0;

  let discount = 0;
  const rule = coupon ? COUPONS[coupon] : undefined;

  if (rule?.type === "percent") {
    discount = Math.round(
      (subtotal * rule.value) / 100,
    );
  }

  if (rule?.type === "fixed") {
    discount = Math.min(rule.value, subtotal);
  }

  if (rule?.type === "free-delivery") {
    deliveryFee = 0;
  }

  return {
    itemCount: activeItems.reduce(
      (count, item) => count + item.quantity,
      0,
    ),
    subtotal,
    discount,
    deliveryFee,
    total:
      Math.max(0, subtotal - discount) +
      deliveryFee,
  };
}
