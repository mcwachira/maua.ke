"use client"

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import * as React from "react"

import { cn } from "@/lib/utils"

function Sheet({
                 ...props
               }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
                        ...props
                      }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return (
      <SheetPrimitive.Trigger
          data-slot="sheet-trigger"
          {...props}
      />
  )
}

function SheetClose({
                      ...props
                    }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return (
      <SheetPrimitive.Close
          data-slot="sheet-close"
          {...props}
      />
  )
}

function SheetPortal({
                       ...props
                     }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return (
      <SheetPrimitive.Portal
          data-slot="sheet-portal"
          {...props}
      />
  )
}

function SheetOverlay({
                        className,
                        ...props
                      }: React.ComponentProps<typeof SheetPrimitive.Backdrop>) {
  return (
      <SheetPrimitive.Backdrop
          data-slot="sheet-overlay"
          className={cn(
              "fixed inset-0 z-50 bg-overlay/70 backdrop-blur-[2px]",
              "data-open:animate-in data-open:fade-in-0",
              "data-closed:animate-out data-closed:fade-out-0",
              "data-open:duration-300 data-closed:duration-200",
              className,
          )}
          {...props}
      />
  )
}

function SheetContent({
                        className,
                        children,
                        side = "right",
                        showCloseButton = true,
                        ...props
                      }: React.ComponentProps<typeof SheetPrimitive.Popup> & {
  side?: "top" | "bottom" | "left" | "right"
  showCloseButton?: boolean
}) {
  return (
      <SheetPortal>
        <SheetOverlay />

        <SheetPrimitive.Popup
            data-slot="sheet-content"
            data-side={side}
            className={cn(
                "fixed z-50 flex flex-col gap-0",
                "bg-background text-foreground",
                "border-2 border-border",
                "outline-none",
                "shadow-[4px_4px_0px_0px_var(--border)]",
                "transition ease-in-out",
                "data-open:animate-in data-closed:animate-out",
                "data-open:duration-300 data-closed:duration-200",

                /* Right */
                side === "right" && [
                  "inset-y-0 right-0 h-full w-[85vw]",
                  "border-l-2",
                  "data-open:slide-in-from-right",
                  "data-closed:slide-out-to-right",
                  "sm:max-w-md",
                ],

                /* Left */
                side === "left" && [
                  "inset-y-0 left-0 h-full w-[85vw]",
                  "border-r-2",
                  "data-open:slide-in-from-left",
                  "data-closed:slide-out-to-left",
                  "sm:max-w-md",
                ],

                /* Top */
                side === "top" && [
                  "inset-x-0 top-0 max-h-[90vh]",
                  "border-b-2",
                  "data-open:slide-in-from-top",
                  "data-closed:slide-out-to-top",
                ],

                /* Bottom - mobile */
                side === "bottom" && [
                  "inset-x-0 bottom-0",
                  "max-h-[90dvh]",
                  "border-t-2",
                  "rounded-t-[1.75rem]",
                  "data-open:slide-in-from-bottom",
                  "data-closed:slide-out-to-bottom",

                  /* Bottom -> centered modal on tablet/desktop */
                  "sm:inset-auto",
                  "sm:left-1/2",
                  "sm:top-1/2",
                  "sm:bottom-auto",
                  "sm:w-[min(680px,calc(100vw-2rem))]",
                  "sm:max-w-none",
                  "sm:max-h-[85dvh]",
                  "sm:-translate-x-1/2",
                  "sm:-translate-y-1/2",
                  "sm:rounded-[1.75rem]",
                  "sm:border-2",

                  "sm:data-open:slide-in-from-bottom-0",
                  "sm:data-closed:slide-out-to-bottom-0",
                ],

                className,
            )}
            {...props}
        >
          {children}

          {showCloseButton && (
              <SheetPrimitive.Close
                  data-slot="sheet-close"
                  className={cn(
                      "absolute right-4 top-4 z-10",
                      "flex size-9 items-center justify-center",
                      "rounded-full",
                      "border border-border",
                      "bg-background",
                      "transition-all",
                      "hover:bg-secondary",
                      "focus:outline-none",
                      "focus:ring-2 focus:ring-ring",
                      "focus:ring-offset-2",
                      "disabled:pointer-events-none",
                  )}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetPortal>
  )
}

function SheetHeader({
                       className,
                       ...props
                     }: React.ComponentProps<"div">) {
  return (
      <div
          data-slot="sheet-header"
          className={cn(
              "flex flex-col gap-1.5 p-5 sm:p-6",
              className,
          )}
          {...props}
      />
  )
}

function SheetFooter({
                       className,
                       ...props
                     }: React.ComponentProps<"div">) {
  return (
      <div
          data-slot="sheet-footer"
          className={cn(
              "mt-auto flex flex-col gap-3 p-5 sm:p-6",
              className,
          )}
          {...props}
      />
  )
}

function SheetTitle({
                      className,
                      ...props
                    }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
      <SheetPrimitive.Title
          data-slot="sheet-title"
          className={cn(
              "text-foreground font-heading",
              className,
          )}
          {...props}
      />
  )
}

function SheetDescription({
                            className,
                            ...props
                          }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
      <SheetPrimitive.Description
          data-slot="sheet-description"
          className={cn(
              "text-sm text-muted-foreground font-base",
              className,
          )}
          {...props}
      />
  )
}

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}