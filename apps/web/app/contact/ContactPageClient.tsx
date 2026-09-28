"use client";

import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Section } from "@/components/Section";

export default function ContactPageClient() {
  const [sending, setSending] = useState(false);
  const [topic, setTopic] = useState("order");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setSending(true);

    setTimeout(() => {
      setSending(false);
      form.reset();
      setTopic("order");

      toast.success(
        "Message sent — we'll reply within a few hours.",
      );
    }, 900);
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We're a phone call away"
        description="Orders, deliveries, corporate flowers or something custom — we'll get back to you the same day."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          {/* Contact form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border-2 border-border bg-card p-4 shadow-[2px_2px_0px_0px_var(--border)] sm:p-6"
          >
            <div className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Phone + Topic */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+254 7xx xxx xxx"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="topic">Topic</Label>

                  <Select
                    value={topic}
                    onValueChange={(value) => setTopic(value ?? "order")}
                  >
                    <SelectTrigger
                      id="topic"
                      className="mt-1.5 w-full"
                      aria-label="Topic"
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="order">
                        An order
                      </SelectItem>
                      <SelectItem value="delivery">
                        Delivery
                      </SelectItem>
                      <SelectItem value="payment">
                        Payment
                      </SelectItem>
                      <SelectItem value="corporate">
                        Corporate / events
                      </SelectItem>
                      <SelectItem value="other">
                        Something else
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="msg">Message</Label>

                <Textarea
                  id="msg"
                  name="message"
                  required
                  rows={6}
                  className="mt-1.5 min-h-36 resize-y"
                  placeholder="Tell us how we can help..."
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="w-full sm:w-auto"
              >
                {sending ? "Sending…" : "Send message"}
              </Button>
            </div>
          </form>

          {/* Contact details */}
          <aside className="space-y-4">
            <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-[2px_2px_0px_0px_var(--border)] sm:p-6">
              <div className="space-y-4 text-sm">
                <a
                  href="tel:+254700000000"
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  <span>+254 700 000 000</span>
                </a>

                <a
                  href="https://wa.me/254700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <MessageCircle className="size-4 shrink-0 text-primary" />
                  <span>WhatsApp us</span>
                </a>

                <a
                  href="mailto:hello@maua.ke"
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  <span className="break-all">hello@maua.ke</span>
                </a>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    Studio &amp; workshop — Kilimani, Nairobi
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    Mon–Sat 8:00 AM – 7:00 PM · Sun 9:00 AM – 4:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* FAQ card */}
            <div className="rounded-2xl border-2 border-border bloom-gradient p-5 shadow-[2px_2px_0px_0px_var(--border)] sm:p-6">
              <p className="font-display text-xl sm:text-2xl">
                Quick answers
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Delivery times, M-Pesa payments and flower care are
                covered in our FAQ.
              </p>

              <Button
                render={
                  <a href="/faq" />
                }
                variant="neutral"
                className="mt-4 w-full"
              >
                Read the FAQ
              </Button>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}