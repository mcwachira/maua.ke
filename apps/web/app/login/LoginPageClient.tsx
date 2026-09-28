"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/AuthShell";
import { GoogleButton } from "@/components/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPageClient() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError);
        return;
      }

      toast.success("Welcome back");
      router.push("/account");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <AuthShell
        title="Welcome back"
        description="Sign in to see your orders, recipients and reminders."
        footer={
          <span className="text-sm sm:text-base">
            New here?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Create an account
            </Link>
          </span>
        }
      >
        <div className="w-full space-y-4 sm:space-y-5">
          <GoogleButton label="Sign in with Google" />

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground sm:gap-3 sm:text-xs">
            <span className="h-px flex-1 bg-border" />

            <span className="shrink-0">
              or use your email
            </span>

            <span className="h-px flex-1 bg-border" />
          </div>

          <form
            onSubmit={submit}
            className="space-y-4 sm:space-y-5"
          >
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                placeholder="you@example.com"
                className="h-11 w-full sm:h-12"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">
                  Password
                </Label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-11 w-full sm:h-12"
              />
            </div>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="border-2 border-destructive bg-destructive/10 px-3 py-2.5 text-sm leading-6 text-destructive"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full sm:h-12"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </AuthShell>
    </main>
  );
}