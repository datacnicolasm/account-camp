export default function RoutePageLoading() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Hero skeleton */}
        <div className="h-40 rounded-2xl bg-muted/40 animate-pulse" />

        {/* Two-column layout skeleton */}
        <div className="space-y-8 lg:grid lg:grid-cols-4 lg:gap-8 lg:space-y-0">
          <div className="space-y-4 lg:col-span-1">
            <div className="h-36 rounded-2xl bg-muted/40 animate-pulse" />
            <div className="h-40 rounded-2xl bg-muted/40 animate-pulse" />
          </div>
          <div className="space-y-4 lg:col-span-3">
            <div className="h-32 rounded-2xl bg-muted/40 animate-pulse" />
            <div className="h-40 rounded-2xl bg-muted/40 animate-pulse" />
            <div className="h-40 rounded-2xl bg-muted/40 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

