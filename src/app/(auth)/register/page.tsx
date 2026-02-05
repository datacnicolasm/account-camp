import Link from "next/link";

export default function RegisterPage() {
  return (
    <main>
      <h1>Registrarse</h1>
      <form>
        <label htmlFor="email">Correo electrónico</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required />
        <button type="submit">Crear cuenta</button>
      </form>
      <Link href="/login">Iniciar sesión</Link>
    </main>
  );
}
