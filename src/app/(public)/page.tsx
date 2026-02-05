import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Plataforma de aprendizaje</h1>
      <p>Bienvenido. Explora nuestros cursos y comienza a aprender.</p>
      <Link href="/login">Iniciar sesión</Link>
      <Link href="/register">Crear cuenta</Link>
    </main>
  );
}
