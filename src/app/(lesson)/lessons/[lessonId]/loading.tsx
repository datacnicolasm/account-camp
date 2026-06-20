export default function LessonViewerLoading() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div className="mx-4 mt-4 h-14 shrink-0 animate-pulse rounded-lg bg-muted/40" />
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-4">
        <div className="mx-auto h-full w-full max-w-6xl animate-pulse rounded-lg bg-muted/40" />
      </div>
      <div className="mx-4 mb-4 h-14 shrink-0 animate-pulse rounded-lg bg-muted/40" />
    </div>
  );
}
