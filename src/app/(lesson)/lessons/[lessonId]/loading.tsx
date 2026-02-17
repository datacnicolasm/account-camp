export default function LessonViewerLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="h-14 shrink-0 rounded-lg bg-muted/40 animate-pulse mx-4 mt-4" />
      <div className="flex-1 min-h-0 px-6 py-6">
        <div className="max-w-6xl mx-auto h-96 rounded-lg bg-muted/40 animate-pulse" />
      </div>
      <div className="h-14 shrink-0 rounded-lg bg-muted/40 animate-pulse mx-4 mb-4" />
    </div>
  );
}
