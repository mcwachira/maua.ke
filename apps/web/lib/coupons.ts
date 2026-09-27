export type CouponRule =
  | {
  type: "percent";
  value: number;
  label: string;
}
  | {
  type: "fixed";
  value: number;
  label: string;
}
  | {
  type: "free-delivery";
  value: number;
  label: string;
};

export const COUPONS: Record<string, CouponRule> = {
  MAUA10: {
    type: "percent",
    value: 10,
    label: "10% off your order",
  },

  FIRSTBLOOM: {
    type: "fixed",
    value: 500,
    label: "KES 500 off your first order",
  },

  FREEDELIVERY: {
    type: "free-delivery",
    value: 0,
    label: "Free delivery",
  },
};

export function validateCoupon(code: string) {
  const normalized = code.trim().toUpperCase();
  const rule = COUPONS[normalized];

  if (!rule) {
    return {
      ok: false,
      code: normalized,
      message: "That code isn't valid or has expired.",
    };
  }

  return {
    ok: true,
    code: normalized,
    rule,
    message: `${rule.label} applied.`,
  };
}