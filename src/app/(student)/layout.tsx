import Link from "next/link";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>
        <Link href="/student">Mis cursos</Link>
        <Link href="/">Inicio</Link>
        <Link href="/login">Salir</Link>
      </nav>
      {children}
    </>
  );
}
