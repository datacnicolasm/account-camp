"use client";

export function SkeletonShell() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex w-16 flex-col border-r border-border bg-sidebar">
        <div className="h-14 flex items-center justify-center border-b border-border">
          <div className="h-6 w-6 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex-1 p-2 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 animate-pulse rounded-md bg-muted"
              style={{ width: "100%" }}
            />
          ))}
        </div>
      </aside>

      {/* Main area skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header skeleton */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 gap-4">
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="flex-1 max-w-md h-9 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
        </header>

        {/* Content skeleton */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl border border-border bg-card"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
