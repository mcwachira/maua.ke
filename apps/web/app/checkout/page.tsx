"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CreditCard,
  Gift,
  Loader2,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
  currency,
  deliverySlots,
  deliveryZones,
  greetingCards,
} from "@/lib/catalog";
import { useShop } from "@/hooks/use-shop";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const steps = [
  "Basket",
  "Recipient",
  "Address",
  "Date",
  "Time",
  "Personalise",
  "Payment",
] as const;

function generateOrderNumber(): string {
  const suffix = Math.floor(
    10000 + Math.random() * 89999,
  );

  return `MK-${suffix}`;
}

function isoDateFromNow(
  offsetMs: number,
): string {
  return new Date(Date.now() + offsetMs)
    .toISOString()
    .slice(0, 10);
}

export default function CheckoutPage() {
  const {
    items,
    totals,
    delivery,
    setDelivery,
    clearCart,
    hydrated,
  } = useShop();

  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardId, setCardId] = useState("none");
  const [message, setMessage] = useState("");

  const active = items.filter((item) => !item.savedForLater);
  const zone = deliveryZones.find(
    (item) => item.slug === delivery.zone,
  );

  if (!hydrated) {
    return (
      <Section>
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </Section>
    );
  }

  if (active.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="Checkout"
          title="Nothing to check out yet"
        />

        <Section>
          <EmptyState
            icon={<Gift className="h-6 w-6" />}
            title="Your basket is empty"
            description="Add a bouquet, gift or care package and we'll walk you through delivery."
            action={
              <Button
                render={<Link href="/shop" />}
                size="lg"
              >
                Explore flowers
              </Button>
            }
          />
        </Section>
      </>
    );
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 1) {
      if (!delivery.recipientName.trim()) {
        nextErrors.recipientName = "Who is this going to?";
      }

      if (
        !/^[0-9+ ]{9,}$/.test(
          delivery.recipientPhone,
        )
      ) {
        nextErrors.recipientPhone =
          "Add a phone number our rider can call.";
      }

      if (!delivery.senderName.trim()) {
        nextErrors.senderName =
          "Tell us who it's from.";
      }
    }

    if (step === 2 && !delivery.address.trim()) {
      nextErrors.address =
        "We need a delivery address.";
    }

    if (step === 3 && !delivery.date) {
      nextErrors.date =
        "Choose a delivery date.";
    }

    if (step === 6) {
      if (
        payment === "mpesa" &&
        !/^[0-9+ ]{9,}$/.test(mpesaPhone)
      ) {
        nextErrors.mpesaPhone =
          "Enter the M-Pesa number to prompt.";
      }

      if (
        payment === "card" &&
        cardNumber.replace(/\s/g, "").length < 15
      ) {
        nextErrors.cardNumber =
          "Enter a valid card number.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (!validate()) return;

    setStep((current) =>
      Math.min(steps.length - 1, current + 1),
    );
  };

  const pay = async () => {
    if (!validate()) return;

    if (!user) {
      toast.error("Please sign in to place your order");
      router.push("/login");
      return;
    }

    setProcessing(true);

    try {
      /*
       * TODO:
       * Replace this demo section with the Laravel API call.
       *
       * Recommended endpoint:
       * POST /api/orders
       *
       * Send:
       * - recipient details
       * - delivery details
       * - cart items
       * - coupon
       * - card/message
       * - payment method
       * - totals
       *
       * The Laravel backend should create the order,
       * validate the totals, process payment and return
       * the order ID.
       */

      const orderNumber = generateOrderNumber();

      const card = greetingCards.find(
        (item) => item.id === cardId,
      );

      const orderPayload = {
        order_number: orderNumber,
        customer_name:
          delivery.senderName ||
          user.name ||
          user.email ||
          "Customer",
        customer_email: user.email ?? null,
        customer_phone:
          delivery.senderPhone ||
          mpesaPhone ||
          null,

        recipient_name: delivery.recipientName,
        recipient_phone: delivery.recipientPhone,
        recipient_email:
          delivery.recipientEmail || null,

        delivery_address: [
          delivery.address,
          delivery.landmark,
        ]
          .filter(Boolean)
          .join(", "),

        delivery_zone:
          zone?.name ?? delivery.zone,

        delivery_date:
          delivery.date || null,

        delivery_slot: delivery.slot,

        delivery_instructions:
          delivery.instructions || null,

        gift_message: message || null,

        hide_price: delivery.hidePrice,

        card_id: card?.id ?? null,

        items: active.map((item) => ({
          product_slug: item.slug,
          name: item.name,
          variant: item.variantName,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          image_url: item.image,
          add_ons: item.addOnIds,
        })),

        subtotal: totals.subtotal,
        delivery_fee: totals.deliveryFee,
        discount: totals.discount,
        total: totals.total,

        payment_method: payment,

        mpesa_phone:
          payment === "mpesa"
            ? mpesaPhone
            : null,
      };

      console.log(
        "Checkout payload:",
        orderPayload,
      );

      /*
       * Temporary demo behaviour while the Laravel
       * backend endpoint is not connected.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 1000),
      );

      setProcessing(false);
      clearCart();

      toast.success(
        "Order received. Payment confirmation will be completed shortly.",
      );

      /*
       * Temporary confirmation ID.
       * Once Laravel is connected, use the returned
       * database order ID here.
       */
      router.push(
        `/order-confirmation/${orderNumber}`,
      );
    } catch {
      setProcessing(false);
      toast.error(
        "We couldn't place that order. Please try again.",
      );
    }
  };

  const today = isoDateFromNow(0);

  const tomorrow = isoDateFromNow(864e5);

  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="Almost there"
        description="Seven quick steps and we'll take it from here."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <ol className="mb-8 flex flex-wrap gap-2 text-xs">
              {steps.map((label, index) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      if (index < step) {
                        setStep(index);
                      }
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5",
                      index === step &&
                      "border-primary bg-primary text-primary-foreground",
                      index < step &&
                      "border-primary text-primary",
                      index > step &&
                      "text-muted-foreground",
                    )}
                  >
                    {index < step && (
                      <Check className="mr-1 inline h-3 w-3" />
                    )}

                    {index + 1}. {label}
                  </button>
                </li>
              ))}
            </ol>

            <div className="rounded-2xl border bg-card p-6">
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl">
                    Review your basket
                  </h2>

                  {active.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-3"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-lg object-cover"
                      />

                      <div className="flex-1 text-sm">
                        <p className="font-medium">
                          {item.name}
                        </p>

                        <p className="text-muted-foreground">
                          {item.variantName} · Qty{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        {currency(
                          item.unitPrice *
                          item.quantity,
                        )}
                      </p>
                    </div>
                  ))}

                  <Button
                    render={<Link href="/cart" />}
                    variant="ghost"
                    size="sm"
                  >
                    Edit basket
                  </Button>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl">
                    Who is it for?
                  </h2>

                  <label className="flex items-center gap-2 rounded-xl border p-3 text-sm">
                    <Checkbox
                      checked={delivery.isGift}
                      onCheckedChange={(value) =>
                        setDelivery({
                          isGift: Boolean(value),
                        })
                      }
                    />

                    I&apos;m sending this as a gift
                  </label>

                  <Field
                    label="Recipient name"
                    error={errors.recipientName}
                  >
                    <Input
                      value={delivery.recipientName}
                      onChange={(event) =>
                        setDelivery({
                          recipientName:
                          event.target.value,
                        })
                      }
                      placeholder="Grace Kimani"
                    />
                  </Field>

                  <Field
                    label="Recipient phone"
                    error={errors.recipientPhone}
                  >
                    <Input
                      value={delivery.recipientPhone}
                      onChange={(event) =>
                        setDelivery({
                          recipientPhone:
                          event.target.value,
                        })
                      }
                      placeholder="+254 7xx xxx xxx"
                    />
                  </Field>

                  <Field label="Recipient email (optional)">
                    <Input
                      type="email"
                      value={delivery.recipientEmail}
                      onChange={(event) =>
                        setDelivery({
                          recipientEmail:
                          event.target.value,
                        })
                      }
                    />
                  </Field>

                  <Separator />

                  <Field
                    label="Your name"
                    error={errors.senderName}
                  >
                    <Input
                      value={delivery.senderName}
                      onChange={(event) =>
                        setDelivery({
                          senderName:
                          event.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field label="Your phone">
                    <Input
                      value={delivery.senderPhone}
                      onChange={(event) =>
                        setDelivery({
                          senderPhone:
                          event.target.value,
                        })
                      }
                    />
                  </Field>

                  {delivery.isGift && (
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={delivery.hidePrice}
                        onCheckedChange={(value) =>
                          setDelivery({
                            hidePrice:
                              Boolean(value),
                          })
                        }
                      />

                      Hide the price from the recipient
                    </label>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl">
                    Where should it go?
                  </h2>

                  <Field label="Delivery area">
                    <Select
                      value={delivery.zone}
                      onValueChange={(value: string | null) => setDelivery({ zone: value ?? "" })}
                    >
                      <SelectTrigger aria-label="Delivery zone">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {deliveryZones.map((zone) => (
                          <SelectItem
                            key={zone.slug}
                            value={zone.slug}
                          >
                            {zone.name} —{" "}
                            {currency(zone.fee)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field
                    label="Street address"
                    error={errors.address}
                  >
                    <Input
                      value={delivery.address}
                      onChange={(event) =>
                        setDelivery({
                          address:
                          event.target.value,
                        })
                      }
                      placeholder="Estate, road, house or apartment number"
                    />
                  </Field>

                  <Field label="Landmark">
                    <Input
                      value={delivery.landmark}
                      onChange={(event) =>
                        setDelivery({
                          landmark:
                          event.target.value,
                        })
                      }
                      placeholder="Opposite the shopping centre"
                    />
                  </Field>

                  <Field label="Delivery instructions">
                    <Textarea
                      value={delivery.instructions}
                      onChange={(event) =>
                        setDelivery({
                          instructions:
                          event.target.value,
                        })
                      }
                      placeholder="Call on arrival, leave at reception, etc."
                    />
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl">
                    When should it arrive?
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={
                        delivery.date === today
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setDelivery({
                          date: today,
                        })
                      }
                      disabled={!zone?.sameDay}
                    >
                      Today
                    </Button>

                    <Button
                      type="button"
                      variant={
                        delivery.date === tomorrow
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setDelivery({
                          date: tomorrow,
                        })
                      }
                    >
                      Tomorrow
                    </Button>
                  </div>

                  <Field
                    label="Or pick a date"
                    error={errors.date}
                  >
                    <Input
                      type="date"
                      value={delivery.date}
                      onChange={(event) =>
                        setDelivery({
                          date:
                          event.target.value,
                        })
                      }
                    />
                  </Field>

                  <p className="rounded-xl bloom-gradient p-3 text-sm">
                    {zone?.sameDay
                      ? `Same-day delivery available in ${zone.name} — order before ${zone.cutoff}.`
                      : `${
                        zone?.name ?? "This area"
                      } is next-day delivery only.`}
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl">
                    Pick a time window
                  </h2>

                  <RadioGroup
                    value={delivery.slot}
                    onValueChange={(value: unknown) => setDelivery({ slot: typeof value === "string" ? value : String(value) })}
                  >
                    {deliverySlots.map((slot) => (
                      <label
                        key={slot.id}
                        className="flex items-center gap-3 rounded-xl border p-4 text-sm"
                      >
                        <RadioGroupItem
                          value={slot.id}
                          id={`slot-${slot.id}`}
                        />

                        <span className="font-medium">
                          {slot.label}
                        </span>

                        <span className="text-muted-foreground">
                          {slot.window}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl">
                    Make it personal
                  </h2>

                  <Field label="Greeting card">
                    <Select
                      value={cardId}
                      onValueChange={(value: string | null) => setCardId(value ?? "none")}
                    >
                      <SelectTrigger aria-label="Greeting card">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="none">
                          No card
                        </SelectItem>

                        {greetingCards.map((card) => (
                          <SelectItem
                            key={card.id}
                            value={card.id}
                          >
                            {card.name} —{" "}
                            {currency(card.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Personal message">
                    <Textarea
                      maxLength={250}
                      value={message}
                      onChange={(event) =>
                        setMessage(
                          event.target.value,
                        )
                      }
                      placeholder="Write something only you would say."
                    />
                  </Field>

                  <p className="text-xs text-muted-foreground">
                    {message.length}/250 characters
                  </p>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl">
                    Payment
                  </h2>

                  <RadioGroup
                    value={payment}
                    onValueChange={(value: unknown) => setPayment(typeof value === "string" ? value : "mpesa")}
                  >
                    <label className="flex items-center gap-3 rounded-xl border p-4 text-sm">
                      <RadioGroupItem
                        value="mpesa"
                        id="pay-mpesa"
                      />

                      <Smartphone className="h-4 w-4 text-primary" />

                      <span className="font-medium">
                        M-Pesa
                      </span>

                      <span className="text-muted-foreground">
                        STK push to your phone
                      </span>
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border p-4 text-sm">
                      <RadioGroupItem
                        value="card"
                        id="pay-card"
                      />

                      <CreditCard className="h-4 w-4 text-primary" />

                      <span className="font-medium">
                        Card
                      </span>

                      <span className="text-muted-foreground">
                        Visa or Mastercard
                      </span>
                    </label>
                  </RadioGroup>

                  {payment === "mpesa" ? (
                    <Field
                      label="M-Pesa number"
                      error={errors.mpesaPhone}
                    >
                      <Input
                        value={mpesaPhone}
                        onChange={(event) =>
                          setMpesaPhone(
                            event.target.value,
                          )
                        }
                        placeholder="+254 7xx xxx xxx"
                      />
                    </Field>
                  ) : (
                    <Field
                      label="Card number"
                      error={errors.cardNumber}
                    >
                      <Input
                        value={cardNumber}
                        onChange={(event) =>
                          setCardNumber(
                            event.target.value,
                          )
                        }
                        placeholder="4242 4242 4242 4242"
                        inputMode="numeric"
                      />
                    </Field>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Demo checkout — no real payment is
                    taken. Payment confirmation will be
                    verified server-side once the Laravel
                    backend is connected.
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setStep((current) =>
                      Math.max(0, current - 1),
                    )
                  }
                  disabled={step === 0}
                >
                  Back
                </Button>

                {step < steps.length - 1 ? (
                  <Button onClick={next}>
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={() => void pay()}
                    disabled={processing}
                    className="min-w-40"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      `Pay ${currency(totals.total)}`
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <aside className="h-fit space-y-3 rounded-2xl border bg-card p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">
              Summary
            </h2>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Items ({totals.itemCount})
                </dt>
                <dd>{currency(totals.subtotal)}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Discount
                </dt>
                <dd>
                  −{currency(totals.discount)}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Delivery
                </dt>
                <dd>
                  {currency(totals.deliveryFee)}
                </dd>
              </div>
            </dl>

            <Separator />

            <div className="flex items-baseline justify-between">
              <span className="font-medium">
                Total
              </span>

              <span className="font-display text-2xl">
                {currency(totals.total)}
              </span>
            </div>

            {delivery.date && (
              <p className="text-xs text-muted-foreground">
                Arriving {delivery.date} ·{" "}
                {
                  deliverySlots.find(
                    (slot) =>
                      slot.id === delivery.slot,
                  )?.window
                }
              </p>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}

function Field({
                 label,
                 error,
                 children,
               }: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">
        {label}
      </Label>

      <div className="mt-1.5">{children}</div>

      {error && (
        <p className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}