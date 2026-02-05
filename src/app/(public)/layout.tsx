import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>
        <Link href="/">Inicio</Link>
        <Link href="/login">Iniciar sesión</Link>
        <Link href="/register">Registrarse</Link>
      </nav>
      {children}
    </>
  );
}
