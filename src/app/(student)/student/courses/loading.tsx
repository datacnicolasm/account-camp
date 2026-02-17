function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-6 w-[80%] animate-pulse rounded bg-muted" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-[85%] animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

export default function CoursesLoading() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Hero skeleton */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="h-12 w-32 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-3">
              <div className="h-7 w-40 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
              <div className="h-4 w-[75%] max-w-md animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="h-9 w-full max-w-sm animate-pulse rounded-full bg-muted" />
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-9 w-40 animate-pulse rounded-full bg-muted" />
            <div className="flex gap-2">
              <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>

        {/* Cards skeleton grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

