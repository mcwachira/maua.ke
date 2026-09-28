"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/Section";
import { api } from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";

interface Recipient {
  id: string;
  name: string;
  relationship?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
}

interface RecipientForm {
  name: string;
  relationship: string;
  phone: string;
  address: string;
  notes: string;
}

export default function RecipientsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const {
    data: recipients,
    isLoading,
  } = useQuery<Recipient[]>({
    queryKey: ["recipients", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () =>
      api<Recipient[]>("/recipients"),
  });

  const add = useMutation({
    mutationFn: (values: RecipientForm) =>
      api<Recipient>("/recipients", {
        method: "POST",
        body: JSON.stringify(values),
      }),

    onSuccess: () => {
      setOpen(false);

      toast.success("Recipient saved");

      void queryClient.invalidateQueries({
        queryKey: ["recipients", user?.id],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      api<void>(`/recipients/${id}`, {
        method: "DELETE",
      }),

    onSuccess: () => {
      toast.success("Recipient removed");

      void queryClient.invalidateQueries({
        queryKey: ["recipients", user?.id],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    add.mutate({
      name: String(form.get("name") ?? ""),
      relationship: String(
        form.get("relationship") ?? "",
      ),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      notes: String(form.get("notes") ?? ""),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl sm:text-3xl">
          Saved recipients
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="w-full sm:w-auto">
                <Plus className="mr-1.5 size-4" />
                Add recipient
              </Button>
            }
          />

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                New recipient
              </DialogTitle>
            </DialogHeader>

            <form
              id="recipient-form"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Name
                  </Label>

                  <Input
                    id="name"
                    name="name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="relationship">
                    Relationship
                  </Label>

                  <Input
                    id="relationship"
                    name="relationship"
                    placeholder="Mum, partner, friend"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  Phone
                </Label>

                <Input
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                  inputMode="tel"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">
                  Address
                </Label>

                <Input
                  id="address"
                  name="address"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">
                  Notes
                </Label>

                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Favourite flowers, allergies, delivery quirks"
                />
              </div>
            </form>

            <DialogFooter>
              <Button
                type="submit"
                form="recipient-form"
                disabled={add.isPending}
                className="w-full sm:w-auto"
              >
                {add.isPending
                  ? "Saving…"
                  : "Save recipient"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">
          Loading…
        </p>
      ) : !recipients || recipients.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" />}
          title="No saved recipients"
          description="Save the people you send to and future orders take seconds."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {recipients.map((recipient) => (
            <li
              key={recipient.id}
              className="border-2 border-border bg-card p-5 shadow-shadow"
            >
              <p className="font-display text-xl">
                {recipient.name}
              </p>

              {recipient.relationship && (
                <p className="text-sm text-primary">
                  {recipient.relationship}
                </p>
              )}

              {recipient.phone && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {recipient.phone}
                </p>
              )}

              {recipient.address && (
                <p className="text-sm text-muted-foreground">
                  {recipient.address}
                </p>
              )}

              {recipient.notes && (
                <p className="mt-2 text-xs italic text-muted-foreground">
                  {recipient.notes}
                </p>
              )}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  render={
                    <a href="/shop" />
                  }
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Send flowers
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full sm:w-auto"
                  disabled={remove.isPending}
                  onClick={() =>
                    remove.mutate(recipient.id)
                  }
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}