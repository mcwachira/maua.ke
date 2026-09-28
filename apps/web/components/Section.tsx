import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b bloom-gradient">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20">
        <div className="max-w-4xl">
          {eyebrow && (
            <p className="eyebrow text-primary">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-2 max-w-4xl text-3xl font-display leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7 md:text-lg">
              {description}
            </p>
          )}

          {children && (
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Decorative background shape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/5 blur-3xl sm:h-72 sm:w-72"
      />
    </header>
  );
}

export function Section({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:px-8 lg:py-20",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-5 sm:mb-8 sm:gap-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 max-w-3xl">
        {eyebrow && (
          <p className="eyebrow text-primary">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1.5 text-2xl font-medium leading-tight tracking-tight sm:text-3xl md:text-4xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0 md:pb-0.5">
          {action}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-5 py-12 text-center sm:min-h-[320px] sm:px-8 sm:py-16">
      {icon && (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bloom-gradient text-primary sm:h-16 sm:w-16">
          {icon}
        </div>
      )}

      <p className="font-display text-xl leading-tight sm:text-2xl">
        {title}
      </p>

      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6 flex w-full justify-center sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}
