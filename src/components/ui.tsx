import type { ComponentProps, ReactNode } from "react";

/*
 * Building blocks styled from design2.md (Genesis / PrimeNG):
 * 7px spacing grid, 21px card radius, pill-shaped controls, the layered
 * blue-tinted shadow stack, and a palette that stays in greys apart from the
 * two semantic colours defined in globals.css.
 */

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`bg-surface border-border rounded-card border p-u5 shadow-card ${className}`}
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
    primary:
      "bg-primary text-primary-ink hover:bg-primary-hover disabled:bg-ink-subtle shadow-hairline",
    outline:
      "bg-surface text-ink border border-border-strong hover:bg-surface-muted",
    ghost: "bg-transparent text-ink-muted hover:bg-surface-muted",
    danger:
      "bg-surface text-danger border border-danger/30 hover:bg-danger-soft",
  };

  return (
    <button
      // Pill geometry with 7px/17.5px padding and weight 500, per design2.
      className={`rounded-pill px-[17.5px] py-u1 text-small font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
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
      <span className="text-ink mb-u1 block text-small font-medium">{label}</span>
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
  "w-full rounded-button bg-surface px-u2 py-[10.5px] text-small text-ink border " +
  "transition-colors focus:border-accent focus:outline-none disabled:bg-surface-muted " +
  "placeholder:text-ink-subtle";

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
      className="rounded-button border-danger/25 bg-danger-soft text-danger border px-u2 py-[10.5px] text-small"
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
      className="rounded-button border-success/25 bg-success-soft text-success border px-u2 py-[10.5px] text-small"
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
      className="border-border rounded-card border border-dashed px-u4 py-u6 text-center"
    >
      <p className="text-h3 text-ink font-semibold">{title}</p>
      {description && (
        <p className="text-ink-muted mt-u1 text-small">{description}</p>
      )}
      {action && <div className="mt-u3">{action}</div>}
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
    neutral: "bg-surface-muted text-ink-subtle border-border",
    busy: "bg-danger-soft text-danger border-danger/20",
    free: "bg-success-soft text-success border-success/20",
    mine: "bg-slate-deep text-primary-ink border-transparent",
  };
  return (
    <span
      className={`rounded-pill border px-[10.5px] py-[3.5px] text-xs font-medium whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
