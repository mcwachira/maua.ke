"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";

interface Profile {
  full_name: string | null;
  phone: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth();

  const {
    data: profile,
    isLoading,
  } = useQuery<Profile>({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => api<Profile>("/profile"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl">
          Profile
        </h2>

        <div className="h-48 animate-pulse border-2 border-border bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl sm:text-3xl">
        Profile
      </h2>

      {/*
       * The key remounts the form whenever the loaded
       * profile changes, so field state is initialised
       * from props instead of synced in an effect.
       */}
      <ProfileForm
        key={`${user?.id}-${profile?.full_name}-${profile?.phone}`}
        email={user?.email ?? ""}
        initialFullName={profile?.full_name ?? ""}
        initialPhone={profile?.phone ?? ""}
        userId={user?.id}
      />
    </div>
  );
}

function ProfileForm({
  email,
  initialFullName,
  initialPhone,
  userId,
}: {
  email: string;
  initialFullName: string;
  initialPhone: string;
  userId: string | number | undefined;
}) {
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);

  const save = useMutation({
    mutationFn: () =>
      api<Profile>("/profile", {
        method: "PUT",
        body: JSON.stringify({
          full_name: fullName,
          phone,
        }),
      }),

    onSuccess: () => {
      toast.success("Profile updated");

      void queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      void queryClient.invalidateQueries({
        queryKey: ["auth-user"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <form
      className="space-y-5 border-2 border-border bg-card p-5 shadow-shadow sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        save.mutate();
      }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="full-name">
              Full name
            </Label>

            <Input
              id="full-name"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              autoComplete="name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              value={email}
              disabled
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="phone">
              Phone
            </Label>

            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              autoComplete="tel"
              inputMode="tel"
              placeholder="+254 7xx xxx xxx"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={save.isPending}
        >
          {save.isPending
            ? "Saving…"
            : "Save changes"}
        </Button>
    </form>
  );
}