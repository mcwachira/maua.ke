"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api/api";

export default function SecurityPage() {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const currentPassword = String(
      form.get("current") ?? "",
    );

    const newPassword = String(
      form.get("new") ?? "",
    );

    const confirmPassword = String(
      form.get("confirm") ?? "",
    );

    if (newPassword.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Those passwords don't match.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api("/auth/password", {
        method: "PUT",
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      event.currentTarget.reset();
      toast.success("Password updated");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your password.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl sm:text-3xl">
        Security
      </h2>

      <form
        className="space-y-5 border-2 border-border bg-card p-5 shadow-shadow sm:p-6"
        onSubmit={handlePasswordChange}
      >
        <h3 className="font-display text-xl sm:text-2xl">
          Change password
        </h3>

        <div className="space-y-1.5">
          <Label htmlFor="current">
            Current password
          </Label>

          <Input
            id="current"
            name="current"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="new">
              New password
            </Label>

            <Input
              id="new"
              name="new"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">
              Confirm password
            </Label>

            <Input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="border-2 border-destructive bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? "Updating…" : "Update password"}
        </Button>
      </form>

      <div className="space-y-5 border-2 border-border bg-card p-5 shadow-shadow sm:p-6">
        <h3 className="font-display text-xl sm:text-2xl">
          Extra protection
        </h3>

        <div className="flex items-center justify-between gap-4">
          <Label
            htmlFor="2fa"
            className="font-normal leading-6"
          >
            Require an SMS code when signing in
          </Label>

          <Switch
            id="2fa"
            defaultChecked
            onCheckedChange={() =>
              toast("Preference updated")
            }
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label
            htmlFor="alerts"
            className="font-normal leading-6"
          >
            Email me about new sign-ins
          </Label>

          <Switch
            id="alerts"
            defaultChecked
            onCheckedChange={() =>
              toast("Preference updated")
            }
          />
        </div>
      </div>

      <div className="space-y-4 border-2 border-border bg-card p-5 shadow-shadow sm:p-6">
        <h3 className="font-display text-xl sm:text-2xl">
          Active sessions
        </h3>

        {[
          {
            device: "Chrome on macOS",
            where: "Nairobi, KE",
            when: "Active now",
          },
          {
            device: "Safari on iPhone",
            where: "Nairobi, KE",
            when: "2 days ago",
          },
        ].map((session) => (
          <div
            key={session.device}
            className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">
                {session.device}
              </p>

              <p className="text-sm text-muted-foreground">
                {session.where} · {session.when}
              </p>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="self-start sm:self-auto"
              onClick={() =>
                toast("Session signed out")
              }
            >
              Sign out
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}