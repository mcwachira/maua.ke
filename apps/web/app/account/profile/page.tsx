"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const {
    data: profile,
    isLoading,
  } = useQuery<Profile>({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => api<Profile>("/profile"),
  });

  useEffect(() => {
    if (!profile) return;

    setFullName(profile.full_name ?? "");
    setPhone(profile.phone ?? "");
  }, [profile]);

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
        queryKey: ["profile", user?.id],
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
    <div className="space-y-6">
      <h2 className="font-display text-2xl sm:text-3xl">
        Profile
      </h2>

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
              value={user?.email ?? ""}
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
          disabled={save.isPending || isLoading}
        >
          {save.isPending
            ? "Saving…"
            : "Save changes"}
        </Button>
      </form>
    </div>
  );
}