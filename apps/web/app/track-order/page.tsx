"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STAGES = ["Order placed", "Payment confirmed", "Preparing bouquet", "Packed", "Out for delivery", "Delivered"];

export default function TrackOrderPage() {
  const [id, setId] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState("");
  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim().length < 4) { setError("Enter a valid order number (at least 4 characters)."); setSubmitted(null); return; }
    setError("");
    setSubmitted(id.trim());
  };
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Track your order</h1>
      <p className="mt-2 text-sm text-muted-foreground">Enter the order number from your confirmation screen. Demo tracking — no backend required.</p>
      <form onSubmit={lookup} className="mt-6 space-y-3">
        <div className="space-y-1.5"><Label htmlFor="oid">Order number</Label><Input id="oid" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. MK-1234" /></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit">Track order</Button>
      </form>
      {submitted && (
        <ol className="mt-8 space-y-0 border-l pl-0">
          {STAGES.map((s, i) => (
            <li key={s} className="relative pb-6 pl-6">
              <span aria-hidden className={`absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full ${i <= 2 ? "bg-primary" : "bg-muted"}`} />
              <p className="text-sm font-medium">{s}</p>
              <p className="text-xs text-muted-foreground">{i <= 2 ? "Completed (demo)" : i === 3 ? "Current stage (demo)" : "Pending"}</p>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
