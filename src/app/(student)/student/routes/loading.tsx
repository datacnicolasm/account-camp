function RouteCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-4 h-6 w-[75%] animate-pulse rounded bg-muted" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-[85%] animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-6 flex justify-end">
        <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

export default function RoutesLoading() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-8 w-56 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-muted" />
            <div className="h-4 w-[80%] max-w-xl animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-9 w-16 animate-pulse rounded-full bg-muted" />
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <RouteCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
