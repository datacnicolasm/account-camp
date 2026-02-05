import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <main>
      <h1>Nueva contraseña</h1>
      <form>
        <label htmlFor="password">Nueva contraseña</label>
        <input id="password" name="password" type="password" required />
        <button type="submit">Guardar cambios</button>
      </form>
      <Link href="/login">Volver a iniciar sesión</Link>
    </main>
  );
}
