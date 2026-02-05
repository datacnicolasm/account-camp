import Link from "next/link";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>
        <Link href="/teacher">Cohortes</Link>
        <Link href="/">Inicio</Link>
        <Link href="/login">Salir</Link>
      </nav>
      {children}
    </>
  );
}
