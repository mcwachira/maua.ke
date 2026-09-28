"use client"
import { ShopContext } from "@/context/shop-context"
import { useContext } from "react"

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside AppProviders");
  return ctx;
}