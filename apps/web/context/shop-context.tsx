"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  products,
} from "@/lib/catalog";

import {
  calculateCartTotals,
} from "@/lib/cart/calculations";

import {
  createCartItemKey,
  type NewCartItem,
} from "@/lib/cart/keys";

import {
  validateCoupon,
} from "@/lib/coupons";

import {
  emptyDelivery,
  loadShopState,
  saveShopState,
} from "@/lib/storage";

import type {
  CartItem,
  CartTotals,
  DeliveryDetails,
} from "@/types/shop";

interface ShopContextValue {
  items: CartItem[];
  wishlist: string[];
  delivery: DeliveryDetails;
  coupon: string | null;

  addItem: (item: NewCartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (
    key: string,
    quantity: number,
  ) => void;
  toggleSaveForLater: (key: string) => void;
  updateItem: (
    key: string,
    patch: Partial<CartItem>,
  ) => void;
  clearCart: () => void;

  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;

  setDelivery: (
    patch: Partial<DeliveryDetails>,
  ) => void;

  applyCoupon: (
    code: string,
  ) => {
    ok: boolean;
    message: string;
  };

  removeCoupon: () => void;

  totals: CartTotals;
  hydrated: boolean;
}

export const ShopContext =
  createContext<ShopContextValue | null>(null);

export function ShopProvider({
                               children,
                             }: {
  children: ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [wishlist, setWishlist] =
    useState<string[]>([]);

  const [delivery, setDeliveryState] =
    useState<DeliveryDetails>(
      emptyDelivery,
    );

  const [coupon, setCoupon] =
    useState<string | null>(null);

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    const stored = loadShopState();

    if (stored) {
      setItems(
        Array.isArray(stored.items)
          ? stored.items
          : [],
      );

      setWishlist(
        Array.isArray(stored.wishlist)
          ? stored.wishlist
          : [],
      );

      setDeliveryState({
        ...emptyDelivery,
        ...(stored.delivery ?? {}),
      });

      setCoupon(
        typeof stored.coupon === "string"
          ? stored.coupon
          : null,
      );
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    saveShopState({
      items,
      wishlist,
      delivery,
      coupon,
    });
  }, [
    items,
    wishlist,
    delivery,
    coupon,
    hydrated,
  ]);

  const addItem = useCallback(
    (item: NewCartItem) => {
      const key = createCartItemKey(item);

      setItems((current) => {
        const existing = current.find(
          (cartItem) =>
            cartItem.key === key,
        );

        if (existing) {
          return current.map((cartItem) =>
            cartItem.key === key
              ? {
                ...cartItem,
                quantity:
                  cartItem.quantity +
                  item.quantity,
              }
              : cartItem,
          );
        }

        return [
          ...current,
          {
            ...item,
            key,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback(
    (key: string) => {
      setItems((current) =>
        current.filter(
          (item) => item.key !== key,
        ),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      setItems((current) =>
        current.map((item) =>
          item.key === key
            ? {
              ...item,
              quantity: Math.max(
                1,
                quantity,
              ),
            }
            : item,
        ),
      );
    },
    [],
  );

  const toggleSaveForLater = useCallback(
    (key: string) => {
      setItems((current) =>
        current.map((item) =>
          item.key === key
            ? {
              ...item,
              savedForLater:
                !item.savedForLater,
            }
            : item,
        ),
      );
    },
    [],
  );

  const updateItem = useCallback(
    (
      key: string,
      patch: Partial<CartItem>,
    ) => {
      setItems((current) =>
        current.map((item) =>
          item.key === key
            ? {
              ...item,
              ...patch,
            }
            : item,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleWishlist = useCallback(
    (slug: string) => {
      setWishlist((current) =>
        current.includes(slug)
          ? current.filter(
            (item) => item !== slug,
          )
          : [...current, slug],
      );
    },
    [],
  );

  const isWishlisted = useCallback(
    (slug: string) =>
      wishlist.includes(slug),
    [wishlist],
  );

  const setDelivery = useCallback(
    (patch: Partial<DeliveryDetails>) => {
      setDeliveryState((current) => ({
        ...current,
        ...patch,
      }));
    },
    [],
  );

  const applyCoupon = useCallback(
    (code: string) => {
      const result =
        validateCoupon(code);

      if (!result.ok) {
        return {
          ok: false,
          message: result.message,
        };
      }

      setCoupon(result.code);

      return {
        ok: true,
        message: result.message,
      };
    },
    [],
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
  }, []);

  const totals = useMemo(
    () =>
      calculateCartTotals(
        items,
        delivery.zone,
        coupon,
      ),
    [items, delivery.zone, coupon],
  );

  const value = useMemo<ShopContextValue>(
    () => ({
      items,
      wishlist,
      delivery,
      coupon,

      addItem,
      removeItem,
      updateQuantity,
      toggleSaveForLater,
      updateItem,
      clearCart,

      toggleWishlist,
      isWishlisted,

      setDelivery,

      applyCoupon,
      removeCoupon,

      totals,
      hydrated,
    }),
    [
      items,
      wishlist,
      delivery,
      coupon,
      addItem,
      removeItem,
      updateQuantity,
      toggleSaveForLater,
      updateItem,
      clearCart,
      toggleWishlist,
      isWishlisted,
      setDelivery,
      applyCoupon,
      removeCoupon,
      totals,
      hydrated,
    ],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

