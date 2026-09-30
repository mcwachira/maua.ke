"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function VerifyInner() {
  const q = useSearchParams();
  const email = q.get("email");
  const [code, setCode] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().length < 4) {
      setErr("Enter the 4+ character demo code.");
      return;
    }
    setErr("");
    setDone(true);
  }

  return (
    <AuthShell
      title="Verify your email"
      description={
        email ? `Code sent to ${email} (demo)` : "Enter the demo code."
      }
    >
      {done ? (
        <p role="status" className="text-sm">
          Verified (demo).{" "}
          <a className="underline" href="/login">
            Log in
          </a>
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="v-code">Verification code</Label>
            <Input
              id="v-code"
              inputMode="numeric"
              value={code}
              onChange={(ev) => setCode(ev.target.value)}
              placeholder="e.g. 123456"
            />
          </div>
          {err && (
            <p role="alert" className="text-sm text-destructive">
              {err}
            </p>
          )}
          <Button className="w-full" type="submit">
            Verify
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}
