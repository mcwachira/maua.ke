"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { CalendarHeart, Plus } from "lucide-react";
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
import { EmptyState } from "@/components/Section";
import { api } from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";

interface Reminder {
  id: string;
  title: string;
  occasion?: string | null;
  person?: string | null;
  remind_on: string;
}

interface ReminderForm {
  title: string;
  occasion: string;
  person: string;
  remind_on: string;
}

export default function RemindersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const {
    data: reminders,
    isLoading,
  } = useQuery<Reminder[]>({
    queryKey: ["reminders", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () =>
      api<Reminder[]>("/reminders"),
  });

  const add = useMutation({
    mutationFn: (values: ReminderForm) =>
      api<Reminder>("/reminders", {
        method: "POST",
        body: JSON.stringify(values),
      }),

    onSuccess: () => {
      setOpen(false);

      toast.success("Reminder saved");

      void queryClient.invalidateQueries({
        queryKey: ["reminders", user?.id],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      api<void>(`/reminders/${id}`, {
        method: "DELETE",
      }),

    onSuccess: () => {
      toast.success("Reminder deleted");

      void queryClient.invalidateQueries({
        queryKey: ["reminders", user?.id],
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
      title: String(form.get("title") ?? ""),
      occasion: String(
        form.get("occasion") ?? "",
      ),
      person: String(form.get("person") ?? ""),
      remind_on: String(
        form.get("remind_on") ?? "",
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl sm:text-3xl">
          Reminders
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="w-full sm:w-auto">
                <Plus className="mr-1.5 size-4" />
                New reminder
              </Button>
            }
          />

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Never forget again
              </DialogTitle>
            </DialogHeader>

            <form
              id="reminder-form"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="space-y-1.5">
                <Label htmlFor="title">
                  What's the occasion?
                </Label>

                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Mum's birthday"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="occasion">
                  Type
                </Label>

                <Input
                  id="occasion"
                  name="occasion"
                  defaultValue="Birthday"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="person">
                  Who is it for?
                </Label>

                <Input
                  id="person"
                  name="person"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="remind_on">
                  Date
                </Label>

                <Input
                  id="remind_on"
                  name="remind_on"
                  type="date"
                  required
                />
              </div>
            </form>

            <DialogFooter>
              <Button
                type="submit"
                form="reminder-form"
                disabled={add.isPending}
                className="w-full sm:w-auto"
              >
                {add.isPending
                  ? "Saving…"
                  : "Save reminder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">
          Loading…
        </p>
      ) : !reminders || reminders.length === 0 ? (
        <EmptyState
          icon={<CalendarHeart className="size-6" />}
          title="No reminders yet"
          description="Add birthdays and anniversaries and we'll nudge you in good time."
        />
      ) : (
        <ul className="space-y-3">
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className="border-2 border-border bg-card p-4 shadow-shadow sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {reminder.title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {reminder.occasion || "Occasion"} ·{" "}
                    {reminder.remind_on}
                    {reminder.person
                      ? ` · for ${reminder.person}`
                      : ""}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    render={<Link href="/shop" />}
                    size="sm"
                    variant="outline"
                  >
                    Send flowers
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={remove.isPending}
                    onClick={() =>
                      remove.mutate(reminder.id)
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}