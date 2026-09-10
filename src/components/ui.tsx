import type { ComponentProps, ReactNode } from "react";

/*
 * Genesis geometry (7px grid, 21px card radius, pill controls, layered shadow)
 * with the indigo accent and motion added on top. Every hover state moves or
 * lifts; nothing depends on that movement to be usable.
 */

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`bg-surface border-border rounded-card shadow-card p-u5 border transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] ${className}`}
      {...props}
    />
  );
}

/** A card that reacts to the pointer — used for rows in a list. */
export function HoverCard({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <Card
      className={`hover:shadow-raised hover:border-primary/30 hover:-translate-y-0.5 ${className}`}
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
    // The one saturated surface in the app, so the main action is never in doubt.
    primary:
      "bg-gradient-to-br from-primary to-violet text-primary-ink shadow-glow " +
      "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(79,70,229,0.7)] " +
      "active:translate-y-0 disabled:from-ink-subtle disabled:to-ink-subtle disabled:shadow-none",
    outline:
      "bg-surface text-ink border border-border-strong hover:border-primary hover:text-primary hover:-translate-y-0.5",
    ghost: "bg-transparent text-ink-muted hover:bg-accent-soft hover:text-primary",
    danger:
      "bg-surface text-danger border border-danger/30 hover:bg-danger hover:text-primary-ink hover:-translate-y-0.5",
  };

  return (
    <button
      // Pill geometry with 7px/17.5px padding and weight 500, per design2.
      className={`rounded-pill px-[17.5px] py-u1 text-small font-medium transition-all duration-200 ease-[var(--ease-out-soft)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${styles[variant]} ${className}`}
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
      <span className="text-ink text-small mb-u1 block font-medium">{label}</span>
      {children}
      {hint && !error && (
        <span className="text-ink-subtle mt-u1 block text-xs">{hint}</span>
      )}
      {error && (
        <span role="alert" className="text-danger animate-fade mt-u1 block text-xs">
          {error}
        </span>
      )}
    </label>
  );
}

const controlBase =
  "w-full rounded-button bg-surface px-u2 py-[10.5px] text-small text-ink border " +
  "transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/12 " +
  "focus:outline-none disabled:bg-surface-muted placeholder:text-ink-subtle";

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
      className="rounded-button border-danger/25 bg-danger-soft text-danger text-small animate-rise px-u2 border py-[10.5px]"
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
      className="rounded-button border-success/25 bg-success-soft text-success text-small animate-rise px-u2 border py-[10.5px]"
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
      className="border-border-strong rounded-card bg-surface/60 animate-rise px-u4 py-u6 border border-dashed text-center backdrop-blur-sm"
    >
      <div className="from-primary to-violet mx-auto mb-u3 flex h-12 w-12 items-center justify-center rounded-pill bg-gradient-to-br text-xl text-white shadow-glow">
        +
      </div>
      <p className="text-h3 text-ink font-semibold">{title}</p>
      {description && (
        <p className="text-ink-muted text-small mt-u1">{description}</p>
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
    mine: "from-primary to-violet border-transparent bg-gradient-to-br text-white",
  };
  return (
    <span
      className={`rounded-pill border px-[10.5px] py-[3.5px] text-xs font-medium whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
