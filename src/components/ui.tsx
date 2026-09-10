import type { ComponentProps, ReactNode } from "react";

/*
 * Small building blocks styled from design.md: 4px radius, Ultima card shadow,
 * #00bcd4 as the single CTA colour, spacing on the 10.5px grid.
 */

export function Card({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={`bg-surface rounded-subtle shadow-card p-u2 ${className}`}
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
      "bg-primary text-primary-ink hover:bg-primary-dark disabled:bg-ink-subtle",
    outline:
      "bg-transparent text-ink border border-border-strong hover:bg-surface-muted",
    ghost: "bg-transparent text-ink-muted hover:bg-surface-muted",
    danger: "bg-transparent text-danger border border-danger hover:bg-danger/5",
  };

  return (
    <button
      className={`rounded-subtle px-u2 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
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
      <span className="text-ink mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && !error && (
        <span className="text-ink-muted mt-1 block text-xs">{hint}</span>
      )}
      {error && (
        <span role="alert" className="text-danger mt-1 block text-xs">
          {error}
        </span>
      )}
    </label>
  );
}

const controlBase =
  "w-full rounded-subtle border bg-surface px-3 py-2 text-sm text-ink " +
  "focus:border-primary focus:outline-none disabled:bg-surface-muted";

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
      className="rounded-subtle border border-danger/30 bg-danger/5 text-danger px-u1 py-2 text-sm"
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
      className="rounded-subtle border border-success/30 bg-success/5 text-success px-u1 py-2 text-sm"
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
      className="border-border rounded-subtle border border-dashed px-u2 py-u3 text-center"
    >
      <p className="text-ink font-medium">{title}</p>
      {description && (
        <p className="text-ink-muted mt-1 text-sm">{description}</p>
      )}
      {action && <div className="mt-u2">{action}</div>}
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
    neutral: "bg-surface-muted text-ink-muted",
    busy: "bg-danger/10 text-danger",
    free: "bg-success/10 text-success",
    mine: "bg-primary/10 text-primary-dark",
  };
  return (
    <span
      className={`rounded-pill px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
