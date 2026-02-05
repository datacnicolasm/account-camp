import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>
        <Link href="/admin">Panel</Link>
        <Link href="/">Inicio</Link>
        <Link href="/login">Salir</Link>
      </nav>
      {children}
    </>
  );
}
