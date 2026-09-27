import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import heroImage from "@/assets/hero-bouquet.jpg";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({
                            title,
                            description,
                            children,
                            footer,
                          }: AuthShellProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Logo */}
          <Link
            href="/"
            className="inline-block font-display text-2xl font-semibold tracking-tight transition-opacity hover:opacity-80 sm:text-3xl"
          >
            Maua<span className="text-primary">.ke</span>
          </Link>

          {/* Heading */}
          <h1 className="mt-6 font-display text-3xl font-semibold leading-tight sm:mt-8 sm:text-4xl">
            {title}
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            {description}
          </p>

          {/* Form content */}
          <div className="mt-6 sm:mt-8">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="mt-6 text-center text-sm leading-6 text-muted-foreground sm:mt-8">
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* Image side */}
      <div className="relative hidden min-h-[calc(100vh-4rem)] lg:block">
        <Image
          src={heroImage}
          alt="Bouquet of blush roses wrapped in cream paper"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-x-6 bottom-6 rounded-xl border-2 border-border bg-card/90 p-5 shadow-shadow backdrop-blur sm:inset-x-8 sm:bottom-8 sm:p-6">
          <p className="font-display text-xl font-semibold leading-tight sm:text-2xl">
            Save recipients, set reminders, reorder in seconds.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            An account keeps every birthday and anniversary in one place.
          </p>
        </div>
      </div>
    </div>
  );
}