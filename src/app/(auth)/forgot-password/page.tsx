import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main>
      <h1>Restablecer contraseña</h1>
      <form>
        <label htmlFor="email">Correo electrónico</label>
        <input id="email" name="email" type="email" required />
        <button type="submit">Enviar enlace</button>
      </form>
      <Link href="/login">Volver a iniciar sesión</Link>
    </main>
  );
}
