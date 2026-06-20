export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-dvh overflow-hidden bg-background">{children}</div>;
}
