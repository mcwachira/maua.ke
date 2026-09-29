"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { currency } from "@/lib/catalog";
import { useShop } from "@/hooks/use-shop";

interface CartDrawerProps {
  children: React.ReactElement;
}

export function CartDrawer({
  children,
}: CartDrawerProps) {
  const [open, setOpen] = useState(false);

  const {
    items,
    totals,
    updateQuantity,
    removeItem,
  } = useShop();

  const active = items.filter(
    (item) => !item.savedForLater,
  );

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger
        render={children}
      />

      <SheetContent
        side="right"
        className="flex w-full flex-col px-4 sm:max-w-md sm:px-6"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="font-display text-xl sm:text-2xl">
            Your basket
          </SheetTitle>
        </SheetHeader>

        {active.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <div className="bloom-gradient rounded-full p-5">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>

            <p className="font-display text-xl">
              Your basket is empty
            </p>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Find something beautiful to send.
            </p>

<Button
                  className="mt-2 rounded-full"
                  onClick={closeDrawer}
                  render={<Link href="/shop" />}
                >
                  Explore flowers
                </Button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="min-h-0 flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {active.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-3"
                  >
                    {/* Product image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-24">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.name}
                          </p>

                          {item.variantName && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {item.variantName}
                            </p>
                          )}

                          {item.cardName && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              Card: {item.cardName}
                            </p>
                          )}
                        </div>

                        {/* Item total */}
                        <p className="shrink-0 text-sm font-semibold">
                          {currency(
                            item.unitPrice *
                              item.quantity,
                          )}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="mt-3 flex items-center">
                        <div className="flex items-center rounded-full border">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-full"
                            aria-label={`Decrease quantity of ${item.name}`}
                            onClick={() =>
                              updateQuantity(
                                item.key,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span
                            className="w-7 text-center text-xs font-medium"
                            aria-label={`Quantity ${item.quantity}`}
                          >
                            {item.quantity}
                          </span>

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-full"
                            aria-label={`Increase quantity of ${item.name}`}
                            onClick={() =>
                              updateQuantity(
                                item.key,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive"
                          aria-label={`Remove ${item.name} from basket`}
                          onClick={() =>
                            removeItem(item.key)
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-3 border-t bg-background pt-4 pb-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span className="font-medium">
                  {currency(totals.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Delivery
                </span>

                <span className="font-medium">
                  {totals.deliveryFee > 0
                    ? currency(
                        totals.deliveryFee,
                      )
                    : "Free"}
                </span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount
                  </span>

                  <span className="font-medium text-primary">
                    -{currency(totals.discount)}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-medium">
                  Total
                </span>

                <span className="font-display text-xl">
                  {currency(totals.total)}
                </span>
              </div>

              {/* Actions */}
              <div className="grid gap-2 pt-1">
<Button
                   size="lg"
                   className="w-full rounded-full"
                   onClick={closeDrawer}
                   render={<Link href="/checkout" />}
                 >
                   Checkout
                 </Button>

                 <Button

                   variant="outline"
                   size="lg"
                   className="w-full rounded-full"
                   onClick={closeDrawer}
                   render={<Link href="/cart" />}
                 >
                   View basket
                 </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
