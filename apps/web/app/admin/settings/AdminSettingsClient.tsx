"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AdminPage } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface FieldProps {
  label: string;
  defaultValue: string;
}

function Field({
                 label,
                 defaultValue,
               }: FieldProps) {
  const id = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        name={id}
        defaultValue={defaultValue}
      />
    </div>
  );
}

interface ToggleProps {
  label: string;
  hint: string;
  defaultChecked?: boolean;
}

function Toggle({
                  label,
                  hint,
                  defaultChecked = false,
                }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-2 border-border p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      </div>

      <Switch
        defaultChecked={defaultChecked}
        aria-label={label}
        className="shrink-0"
      />
    </div>
  );
}

export default function AdminSettingsClient() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSaving(true);

    // TODO: Connect to Laravel admin settings API.
    window.setTimeout(() => {
      setSaving(false);
      toast.success(
        "Settings saved locally. Laravel API connection is still pending.",
      );
    }, 500);
  };

  return (
    <AdminPage
      title="Settings"
      description="Store details, payments and notification preferences."
      action={
        <Button
          type="submit"
          form="admin-settings-form"
          size="sm"
          disabled={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      }
    >
      <form
        id="admin-settings-form"
        className="grid gap-4 sm:gap-6 lg:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <section className="space-y-4 border-2 border-border bg-card p-4 shadow-shadow sm:p-5">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">
            Store details
          </h2>

          <Field
            label="Store name"
            defaultValue="Maua.ke"
          />

          <Field
            label="Support email"
            defaultValue="hello@maua.ke"
          />

          <Field
            label="Support phone"
            defaultValue="+254 700 000 000"
          />

          <div className="space-y-1.5">
            <Label htmlFor="address">
              Studio address
            </Label>

            <Textarea
              id="address"
              name="address"
              defaultValue="Wood Avenue, Kilimani, Nairobi"
              className="min-h-24"
            />
          </div>
        </section>

        <section className="space-y-4 border-2 border-border bg-card p-4 shadow-shadow sm:p-5">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">
            Commerce
          </h2>

          <Field
            label="Currency"
            defaultValue="KES"
          />

          <Field
            label="Same-day cut-off"
            defaultValue="3:00 PM"
          />

          <Field
            label="Free delivery threshold"
            defaultValue="10000"
          />

          <Field
            label="Default delivery zone"
            defaultValue="Nairobi — CBD & Westlands"
          />
        </section>

        <section className="space-y-3 border-2 border-border bg-card p-4 shadow-shadow sm:p-5">
          <h2 className="mb-1 font-display text-xl font-semibold sm:text-2xl">
            Payments
          </h2>

          <Toggle
            label="M-Pesa STK Push"
            hint="Collect payments via Daraja."
            defaultChecked
          />

          <Toggle
            label="Card payments"
            hint="Visa and Mastercard checkout."
            defaultChecked
          />

          <Toggle
            label="Pay on delivery"
            hint="Cash collected by the rider."
          />
        </section>

        <section className="space-y-3 border-2 border-border bg-card p-4 shadow-shadow sm:p-5">
          <h2 className="mb-1 font-display text-xl font-semibold sm:text-2xl">
            Notifications
          </h2>

          <Toggle
            label="Order SMS updates"
            hint="Text the sender at each status change."
            defaultChecked
          />

          <Toggle
            label="Recipient delivery SMS"
            hint="Let the recipient know a gift is on the way."
            defaultChecked
          />

          <Toggle
            label="Occasion reminders"
            hint="Email customers before saved dates."
            defaultChecked
          />
        </section>
      </form>
    </AdminPage>
  );
}