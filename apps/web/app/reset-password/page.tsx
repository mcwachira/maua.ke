"use client";

import { useState } from "react";

import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    if (pw !== pw2) {
      setErr("Passwords do not match.");
      return;
    }
    setErr("");
    setDone(true);
  }

  return (
    <AuthShell title="Choose a new password" description="Demo only.">
      {done ? (
        <p role="status" className="text-sm">
          Password updated (demo).{" "}
          <a className="underline" href="/login">
            Log in
          </a>
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="rp-1">New password</Label>
            <Input
              id="rp-1"
              type="password"
              value={pw}
              onChange={(ev) => setPw(ev.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rp-2">Confirm password</Label>
            <Input
              id="rp-2"
              type="password"
              value={pw2}
              onChange={(ev) => setPw2(ev.target.value)}
            />
          </div>
          {err && (
            <p role="alert" className="text-sm text-destructive">
              {err}
            </p>
          )}
          <Button className="w-full" type="submit">
            Reset password
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
