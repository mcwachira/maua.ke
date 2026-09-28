"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/Section";
import { useAuth } from "@/hooks/useAuth";
import {
    createAddress,
    deleteAddress,
    getAddresses,
    type Address,
    type CreateAddressInput,
} from "@/lib/api/account-api";

export default function AddressesPageClient() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);

    const {
        data: addresses = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["addresses", user?.id],
        enabled: Boolean(user?.id),
        queryFn: () => getAddresses(),
    });

    const add = useMutation({
        mutationFn: (values: CreateAddressInput) =>
            createAddress(values),

        onSuccess: () => {
            setOpen(false);

            toast.success("Address saved");

            void queryClient.invalidateQueries({
                queryKey: ["addresses", user?.id],
            });
        },

        onError: (error: Error) => {
            toast.error(
                error.message || "Unable to save address.",
            );
        },
    });

    const remove = useMutation({
        mutationFn: (id: string | number) =>
            deleteAddress(id),

        onSuccess: () => {
            toast.success("Address removed");

            void queryClient.invalidateQueries({
                queryKey: ["addresses", user?.id],
            });
        },

        onError: (error: Error) => {
            toast.error(
                error.message || "Unable to remove address.",
            );
        },
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);

        const values: CreateAddressInput = {
            label: String(form.get("label") ?? "").trim(),
            line1: String(form.get("line1") ?? "").trim(),
            city: String(form.get("city") ?? "").trim(),
            phone: String(form.get("phone") ?? "").trim(),
            is_default: addresses.length === 0,
        };

        add.mutate(values);
    };

    if (!user) {
        return (
            <EmptyState
                icon={<MapPin className="size-6" />}
                title="Sign in to manage your addresses"
                description="Your saved delivery addresses will appear here."
            />
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                        Addresses
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                        Save delivery addresses to make checkout faster.
                    </p>
                </div>

                <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={() => setOpen(true)}
                >
                    <Plus className="size-4" />
                    Add address
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[calc(100%-2rem)] max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl">
                            New address
                        </DialogTitle>
                    </DialogHeader>

                    <form
                        id="address-form"
                        className="space-y-4"
                        onSubmit={submit}
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="label">Label</Label>

                            <Input
                                id="label"
                                name="label"
                                required
                                placeholder="Home"
                                autoComplete="address-line1"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="line1">Address</Label>

                            <Input
                                id="line1"
                                name="line1"
                                required
                                placeholder="Estate, road, house number"
                                autoComplete="street-address"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="city">Town / city</Label>

                            <Input
                                id="city"
                                name="city"
                                required
                                defaultValue="Nairobi"
                                autoComplete="address-level2"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone</Label>

                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                inputMode="tel"
                                required
                                placeholder="+254 7xx xxx xxx"
                                autoComplete="tel"
                            />
                        </div>
                    </form>

                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => setOpen(false)}
                            disabled={add.isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            form="address-form"
                            className="w-full sm:w-auto"
                            disabled={add.isPending}
                        >
                            {add.isPending
                                ? "Saving…"
                                : "Save address"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="h-44 animate-pulse border-2 border-border bg-muted shadow-shadow"
                        />
                    ))}
                </div>
            ) : isError ? (
                <div className="border-2 border-destructive bg-destructive/10 p-5">
                    <p className="text-sm font-medium text-destructive">
                        Unable to load your addresses.
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Please try again in a moment.
                    </p>
                </div>
            ) : addresses.length === 0 ? (
                <EmptyState
                    icon={<MapPin className="size-6" />}
                    title="No saved addresses"
                    description="Add one to make checkout faster."
                    action={
                        <Button
                            type="button"
                            onClick={() => setOpen(true)}
                        >
                            <Plus className="size-4" />
                            Add address
                        </Button>
                    }
                />
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            removing={
                                remove.isPending &&
                                remove.variables === address.id
                            }
                            onRemove={() =>
                                remove.mutate(address.id)
                            }
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

interface AddressCardProps {
    address: Address;
    removing: boolean;
    onRemove: () => void;
}

function AddressCard({
                         address,
                         removing,
                         onRemove,
                     }: AddressCardProps) {
    return (
        <li className="flex min-h-48 flex-col border-2 border-border bg-card p-4 shadow-shadow transition-transform hover:-translate-y-0.5 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <MapPin className="size-4 shrink-0" />

                    <p className="truncate font-semibold">
                        {address.label}
                    </p>
                </div>

                {address.is_default && (
                    <Badge variant="secondary" className="shrink-0">
                        Default
                    </Badge>
                )}
            </div>

            <div className="mt-4 flex-1 space-y-0.5">
                <p className="text-sm leading-6 text-muted-foreground">
                    {address.line1}
                </p>

                <p className="text-sm leading-6 text-muted-foreground">
                    {address.city}
                </p>

                {address.phone && (
                    <p className="text-sm leading-6 text-muted-foreground">
                        {address.phone}
                    </p>
                )}
            </div>

            <div className="mt-4 border-t-2 border-border pt-3">
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={removing}
                    onClick={onRemove}
                    className="w-full sm:w-auto"
                >
                    {removing ? "Removing…" : "Remove"}
                </Button>
            </div>
        </li>
    );
}