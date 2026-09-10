/** Loading state (Requirement 9) — shown while a Server Component streams. */
export default function Loading() {
  return (
    <div className="space-y-u1" aria-busy="true" data-testid="loading">
      <div className="bg-surface-muted h-6 w-48 animate-pulse rounded-subtle" />
      <div className="bg-surface-muted h-32 w-full animate-pulse rounded-subtle" />
      <div className="bg-surface-muted h-32 w-full animate-pulse rounded-subtle" />
    </div>
  );
}
