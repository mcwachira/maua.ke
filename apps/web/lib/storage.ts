import type {
  DeliveryDetails,
  StoredShopState,
  ThemeMode,
} from "@/types/shop";

export const SHOP_STORAGE_KEY = "maua-shop-v1";
export const THEME_STORAGE_KEY = "maua-theme";

export const emptyDelivery: DeliveryDetails = {
  isGift: false,
  recipientName: "",
  recipientPhone: "",
  recipientEmail: "",
  senderName: "",
  senderPhone: "",
  zone: "nairobi-cbd",
  address: "",
  landmark: "",
  instructions: "",
  date: "",
  slot: "morning",
  hidePrice: true,
};

export function loadTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";

  const value = localStorage.getItem(THEME_STORAGE_KEY);

  if (
    value === "light" ||
    value === "dark" ||
    value === "system"
  ) {
    return value;
  }

  return "system";
}

export function saveTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function loadShopState(): Partial<StoredShopState> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SHOP_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed as Partial<StoredShopState>;
  } catch {
    return null;
  }
}

export function saveShopState(state: StoredShopState) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    SHOP_STORAGE_KEY,
    JSON.stringify(state),
  );
}
