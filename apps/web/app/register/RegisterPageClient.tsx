"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/AuthShell";
import { GoogleButton } from "@/components/GoogleButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPageClient() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (password.length < 8) {
      setError(
        "Use at least 8 characters for your password.",
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { error: signUpError } = await signUp(
        email,
        password,
        {
          full_name: name,
          phone,
        },
      );

      if (signUpError) {
        setError(signUpError);
        return;
      }

      toast.success("Account created — you're signed in");
      router.push("/account");
    } catch {
      setError(
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <AuthShell
        title="Create your account"
        description="It takes about thirty seconds and makes every future order faster."
        footer={
          <span className="text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </span>
        }
      >
        <div className="w-full space-y-4 sm:space-y-5">
          <GoogleButton label="Sign up with Google" />

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
            {/* Full name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Full name
              </Label>

              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="h-11 w-full sm:h-12"
                placeholder="Your full name"
              />
            </div>

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
                className="h-11 w-full sm:h-12"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Phone
              </Label>

              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                required
                className="h-11 w-full sm:h-12"
                placeholder="+254 7xx xxx xxx"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="h-11 w-full sm:h-12"
                placeholder="At least 8 characters"
              />

              <p className="text-xs leading-5 text-muted-foreground">
                Use at least 8 characters.
              </p>
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

            {/* Terms */}
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="terms"
                name="terms"
                required
                className="mt-0.5 shrink-0"
              />

              <Label
                htmlFor="terms"
                className="cursor-pointer text-xs font-normal leading-5 text-muted-foreground sm:text-sm sm:leading-6"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  privacy policy
                </Link>
                .
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 w-full sm:h-12"
              disabled={loading}
            >
              {loading
                ? "Creating account…"
                : "Create account"}
            </Button>
          </form>
        </div>
      </AuthShell>
    </main>
  );
}