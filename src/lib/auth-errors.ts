import { isAuthApiError } from "@supabase/supabase-js";

/**
 * Maps Supabase Auth errors to user-friendly Spanish messages.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (isAuthApiError(error)) {
    const code = error.code;
    const status = error.status;

    switch (code) {
      case "invalid_credentials":
        return "Correo o contraseña incorrectos. Revisa tus datos e intenta de nuevo.";
      case "email_not_confirmed":
        return "Confirma tu correo electrónico antes de iniciar sesión.";
      case "user_banned":
        return "Tu cuenta ha sido suspendida. Contacta al soporte.";
      case "over_request_rate_limit":
        return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
      case "over_email_send_rate_limit":
        return "Demasiados correos enviados. Espera unos minutos.";
      case "email_provider_disabled":
        return "El inicio de sesión con correo está deshabilitado.";
      default:
        break;
    }

    if (status === 429) {
      return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
    }
    if (status >= 500) {
      return "Error del servidor. Intenta de nuevo más tarde.";
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("Invalid login credentials")) {
      return "Correo o contraseña incorrectos. Revisa tus datos e intenta de nuevo.";
    }
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return "Error de conexión. Revisa tu internet e intenta de nuevo.";
    }
  }

  return "Ocurrió un error. Intenta de nuevo.";
}
