/** Loading state (Requirement 9) — shown while a Server Component streams. */
export default function Loading() {
  return (
    <div className="space-y-u3" aria-busy="true" data-testid="loading">
      <Placeholder className="h-10 w-72" />
      <Placeholder className="rounded-card h-24 w-full" />
      <Placeholder className="rounded-card h-64 w-full" />
    </div>
  );
}

/** A frosted panel that breathes — quieter than a flashing grey block. */
function Placeholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`glass rounded-button animate-pulse [animation-duration:2.4s] ${className}`}
    />
  );
}
