"use client";

import { useState } from "react";

import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setErr("Enter a valid email.");
      return;
    }
    setErr("");
    setDone(true);
  }

  return (
    <AuthShell
      title="Reset password"
      description="Demo reset — Laravel will send the real email."
    >
      {done ? (
        <p role="status" className="text-sm">
          If an account exists for {email}, a reset link was sent (demo).
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fp-email">Email</Label>
            <Input
              id="fp-email"
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          {err && (
            <p role="alert" className="text-sm text-destructive">
              {err}
            </p>
          )}
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
