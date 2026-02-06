import { StudentShell } from "@/components/shell/StudentShell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentShell>{children}</StudentShell>;
}
