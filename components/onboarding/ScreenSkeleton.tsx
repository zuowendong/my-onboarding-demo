/**
 * Screen-level loading skeleton shown while the persisted store rehydrates
 * (AGENTS.md §7 loading state). Prevents an SSR/CSR mismatch on data screens.
 */
export function ScreenSkeleton() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Loading screen">
      <div className="space-y-2">
        <div className="h-6 w-2/3 rounded bg-border" />
        <div className="h-4 w-full rounded bg-border" />
      </div>
      <div className="space-y-4">
        <div className="h-11 w-full rounded-field bg-border" />
        <div className="h-11 w-full rounded-field bg-border" />
      </div>
      <div className="h-12 w-full rounded-full bg-border" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
