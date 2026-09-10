/** Loading state (Requirement 9) — shown while a Server Component streams. */
export default function Loading() {
  return (
    <div className="space-y-u3" aria-busy="true" data-testid="loading">
      <Shimmer className="h-10 w-72" />
      <Shimmer className="rounded-card h-48 w-full" />
      <Shimmer className="rounded-card h-32 w-full" />
    </div>
  );
}

/** A sweeping highlight rather than a pulse — it reads as progress, not a blink. */
function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-button animate-shimmer bg-[linear-gradient(90deg,var(--color-surface-muted)_25%,var(--color-accent-soft)_50%,var(--color-surface-muted)_75%)] bg-[length:200%_100%] ${className}`}
    />
  );
}
