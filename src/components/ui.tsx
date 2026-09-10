import type { ComponentProps, ReactNode } from "react";

/*
 * Genesis geometry (7px grid, 21px radius, pill controls) rendered in the
 * premium-property vocabulary: frosted panels, warm neutrals, a charcoal
 * primary action, brass only on hairlines and marks.
 */

/** The default surface: frosted, so the lit canvas shows through it. */
export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`glass rounded-card p-u5 transition-[transform,box-shadow] duration-500 ease-[var(--ease-calm)] ${className}`}
      {...props}
    />
  );
}

/** A panel that lifts under the pointer — for rows in a list. */
export function HoverCard({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <Card
      className={`hover:shadow-raised hover:-translate-y-1 ${className}`}
      {...props}
    />
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "ghost" | "danger" | "outline";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles: Record<string, string> = {
    // Filled charcoal. A coloured button reads as an app; this reads as a brand.
    primary:
      "bg-primary text-primary-ink hover:bg-primary-hover shadow-hairline hover:shadow-raised disabled:bg-ink-subtle",
    outline:
      "bg-transparent text-ink border border-border-strong hover:border-brass hover:text-brass-ink",
    ghost: "bg-transparent text-ink-muted hover:text-ink hover:bg-surface-muted",
    danger:
      "bg-transparent text-danger border border-danger/30 hover:bg-danger hover:text-primary-ink",
  };

  return (
    <button
      className={`rounded-pill px-u4 py-[9px] text-small font-medium tracking-wide transition-all duration-300 ease-[var(--ease-calm)] disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      {/* Small caps with letter-spacing — the label style of a property spec sheet. */}
      <span className="text-ink-muted mb-u1 block text-[11px] font-semibold tracking-[0.14em] uppercase">
        {label}
      </span>
      {children}
      {hint && !error && (
        <span className="text-ink-subtle mt-u1 block text-xs">{hint}</span>
      )}
      {error && (
        <span role="alert" className="text-danger mt-u1 block text-xs">
          {error}
        </span>
      )}
    </label>
  );
}

const controlBase =
  "w-full rounded-button bg-surface/70 px-u2 py-[11px] text-small text-ink border " +
  "transition-all duration-300 focus:border-brass focus:bg-surface focus:outline-none " +
  "disabled:bg-surface-muted placeholder:text-ink-subtle";

export function Input({
  invalid,
  className = "",
  ...props
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`${controlBase} ${invalid ? "border-danger" : "border-border-strong"} ${className}`}
      {...props}
    />
  );
}

export function Select({
  invalid,
  className = "",
  ...props
}: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={`${controlBase} ${invalid ? "border-danger" : "border-border-strong"} ${className}`}
      {...props}
    />
  );
}

export function Textarea({
  invalid,
  className = "",
  ...props
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={`${controlBase} ${invalid ? "border-danger" : "border-border-strong"} ${className}`}
      {...props}
    />
  );
}

/** Error state — the one place users see a mapped database message. */
export function ErrorBanner({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      data-testid="error-banner"
      className="rounded-button border-danger/25 bg-danger-soft text-danger text-small border-l-2 border-l-danger px-u3 border py-[11px]"
    >
      {children}
    </div>
  );
}

export function SuccessBanner({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div
      role="status"
      className="rounded-button border-success/25 bg-success-soft text-success text-small border-l-2 border-l-success px-u3 border py-[11px]"
    >
      {children}
    </div>
  );
}

/** Empty state — required by Requirement 9. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      data-testid="empty-state"
      className="glass rounded-card px-u4 py-u6 text-center"
    >
      <div className="border-brass/40 text-brass-ink mx-auto mb-u3 flex h-14 w-14 items-center justify-center rounded-pill border text-lg">
        ✦
      </div>
      <p className="font-heading text-h3 text-ink">{title}</p>
      {description && (
        <p className="text-ink-muted text-small mt-u1">{description}</p>
      )}
      {action && <div className="mt-u4">{action}</div>}
    </div>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "busy" | "free" | "mine";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-surface-muted text-ink-muted border-border",
    busy: "bg-danger-soft text-danger border-danger/20",
    free: "bg-success-soft text-success border-success/20",
    mine: "bg-primary text-primary-ink border-transparent",
  };
  return (
    <span
      className={`rounded-pill border px-u2 py-[3px] text-[11px] font-medium tracking-wide whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** A labelled figure — the "3 beds · 2 baths" device from a listing card. */
export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="font-heading text-h3 text-ink leading-none">{value}</div>
      <div className="text-ink-subtle mt-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
        {label}
      </div>
    </div>
  );
}
