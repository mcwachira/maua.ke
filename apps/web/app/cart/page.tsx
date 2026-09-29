"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    EmptyState,
    PageHeader,
    Section,
} from "@/components/Section";
import {
    addOns,
    currency,
    deliveryZones,
} from "@/lib/catalog";
import type { AddOn } from "@/lib/catalog";
import { useShop } from "@/hooks/use-shop";
import type { CartItem } from "@/types/shop";

export default function CartPage() {
    const {
        items,
        totals,
        updateQuantity,
        removeItem,
        toggleSaveForLater,
        delivery,
        setDelivery,
        coupon,
        applyCoupon,
        removeCoupon,
        hydrated,
    } = useShop();

    const [code, setCode] = useState("");

    const active = items.filter((item) => !item.savedForLater);
    const saved = items.filter((item) => item.savedForLater);

    if (!hydrated) {
        return (
            <Section>
                <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            </Section>
        );
    }

    return (
        <>
            <PageHeader
                eyebrow="Basket"
                title="Your basket"
            />

            <Section>
                {active.length === 0 && saved.length === 0 ? (
                    <EmptyState
                        icon={<ShoppingBag className="h-6 w-6" />}
                        title="Your basket is empty"
                        description="Find something beautiful to send."
                        action={
                            <Button
                                render={<Link href="/shop" />}
                                size="lg"
                            >
                                Explore flowers
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-4">
                            {active.map((item: CartItem) => {
                                const itemAddOns = item.addOnIds
                                    .map((id: string) => addOns.find((addOn: AddOn) => addOn.id === id))
                                    .filter((a): a is AddOn => Boolean(a));

                                return (
                                    <article
                                        key={item.key}
                                        className="flex gap-4 rounded-2xl border bg-card p-4"
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            loading="lazy"
                                            width={112}
                                            height={112}
                                            className="h-28 w-28 rounded-xl object-cover"
                                        />

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <Link
                                                        href={`/products/${item.slug}`}
                                                        className="font-display text-xl hover:text-primary"
                                                    >
                                                        {item.name}
                                                    </Link>

                                                    <p className="text-sm text-muted-foreground">
                                                        {item.variantName}
                                                    </p>
                                                </div>

                                                <p className="font-semibold">
                                                    {currency(item.unitPrice * item.quantity)}
                                                </p>
                                            </div>

                                            {itemAddOns.length > 0 && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Add-ons:{" "}
                                                    {itemAddOns
                                                        .map((addOn) => addOn.name)
                                                        .join(", ")}
                                                </p>
                                            )}

                                            {item.cardName && (
                                                <p className="text-xs text-muted-foreground">
                                                    Card: {item.cardName}
                                                </p>
                                            )}

                                            {item.message && (
                                                <p className="mt-2 rounded-lg bg-muted p-2 text-xs italic">
                                                    “{item.message}”
                                                </p>
                                            )}

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <div className="flex items-center gap-1 rounded-full border p-1">
                                                    <Button
                                                        size="icon-xs"
                                                        variant="ghost"
                                                        className="rounded-full"
                                                        aria-label="Decrease quantity"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.key,
                                                                item.quantity - 1,
                                                            )
                                                        }
                                                    >
                                                        <Minus />
                                                    </Button>

                                                    <span className="w-7 text-center text-sm">
                            {item.quantity}
                          </span>

                                                    <Button
                                                        size="icon-xs"
                                                        variant="ghost"
                                                        className="rounded-full"
                                                        aria-label="Increase quantity"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.key,
                                                                item.quantity + 1,
                                                            )
                                                        }
                                                    >
                                                        <Plus />
                                                    </Button>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        toggleSaveForLater(item.key)
                                                    }
                                                >
                                                    Save for later
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        removeItem(item.key);
                                                        toast("Removed from basket");
                                                    }}
                                                >
                                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}

                            {saved.length > 0 && (
                                <div className="pt-6">
                                    <h2 className="mb-3 font-display text-2xl">
                                        Saved for later
                                    </h2>

                                    <div className="space-y-3">
                                        {saved.map((item) => (
                                            <div
                                                key={item.key}
                                                className="flex items-center gap-4 rounded-2xl border bg-card p-4"
                                            >
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    width={64}
                                                    height={64}
                                                    className="h-16 w-16 rounded-lg object-cover"
                                                />

                                                <div className="flex-1 text-sm">
                                                    <p className="font-medium">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        {currency(item.unitPrice)}
                                                    </p>
                                                </div>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        toggleSaveForLater(item.key)
                                                    }
                                                >
                                                    Move to basket
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <aside className="h-fit space-y-4 rounded-2xl border bg-card p-6 lg:sticky lg:top-28">
                            <h2 className="font-display text-2xl">
                                Order summary
                            </h2>

                            <div>
                                <Label className="text-xs text-muted-foreground">
                                    Delivery location
                                </Label>

                                <Select
                                    value={delivery.zone}
                                    onValueChange={(value: string | null) =>
                                        setDelivery({ zone: value ?? "" })
                                    }
                                >
                                    <SelectTrigger
                                        className="mt-1.5"
                                        aria-label="Delivery zone"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {deliveryZones.map((zone) => (
                                            <SelectItem
                                                key={zone.slug}
                                                value={zone.slug}
                                            >
                                                {zone.name} — {currency(zone.fee)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label
                                    htmlFor="delivery-date"
                                    className="text-xs text-muted-foreground"
                                >
                                    Delivery date
                                </Label>

                                <Input
                                    id="delivery-date"
                                    type="date"
                                    className="mt-1.5"
                                    value={delivery.date}
                                    onChange={(event) =>
                                        setDelivery({
                                            date: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <form
                                className="flex gap-2"
                                onSubmit={(event) => {
                                    event.preventDefault();

                                    const result = applyCoupon(code);

                                    if (result.ok) {
                                        toast.success(result.message);
                                        setCode("");
                                    } else {
                                        toast.error(result.message);
                                    }
                                }}
                            >
                                <Input
                                    value={code}
                                    onChange={(event) =>
                                        setCode(event.target.value)
                                    }
                                    placeholder="Coupon code"
                                    aria-label="Coupon code"
                                />

                                <Button type="submit" variant="outline">
                                    Apply
                                </Button>
                            </form>

                            {coupon && (
                                <p className="flex items-center gap-2 text-sm text-primary">
                                    <Tag className="h-4 w-4" />
                                    {coupon} applied

                                    <button
                                        type="button"
                                        className="ml-auto text-xs underline"
                                        onClick={removeCoupon}
                                    >
                                        Remove
                                    </button>
                                </p>
                            )}

                            <Separator />

                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Subtotal
                                    </dt>
                                    <dd>{currency(totals.subtotal)}</dd>
                                </div>

                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Discount
                                    </dt>
                                    <dd>−{currency(totals.discount)}</dd>
                                </div>

                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Delivery
                                    </dt>
                                    <dd>{currency(totals.deliveryFee)}</dd>
                                </div>
                            </dl>

                            <Separator />

                            <div className="flex items-baseline justify-between">
                                <span className="font-medium">Total</span>
                                <span className="font-display text-2xl">
                  {currency(totals.total)}
                </span>
                            </div>

                            <Button
                                render={<Link href="/checkout" />}
                                size="lg"
                                className="w-full rounded-full"
                                disabled={active.length === 0}
                            >
                                Continue to checkout
                            </Button>

                            <Button
                                render={<Link href="/shop" />}
                                variant="ghost"
                                className="w-full"
                            >
                                Keep shopping
                            </Button>
                        </aside>
                    </div>
                )}
            </Section>
        </>
    );
}