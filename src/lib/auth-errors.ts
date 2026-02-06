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

/**
 * Maps Supabase signUp errors to user-friendly Spanish messages.
 */
export function getSignUpErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("already registered") ||
      msg.includes("already been registered") ||
      msg.includes("user already exists")
    ) {
      return "Este correo ya está registrado. Inicia sesión o restablece tu contraseña.";
    }
    if (
      msg.includes("password should be") ||
      msg.includes("weak") ||
      msg.includes("too short")
    ) {
      return "La contraseña es muy débil. Usa al menos 8 caracteres.";
    }
    if (msg.includes("fetch") || msg.includes("network")) {
      return "Error de conexión. Revisa tu internet e intenta de nuevo.";
    }
  }

  if (isAuthApiError(error)) {
    const status = error.status;
    if (status === 429) {
      return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
    }
    if (status >= 500) {
      return "Error del servidor. Intenta de nuevo más tarde.";
    }
  }

  return "Ocurrió un error. Intenta de nuevo.";
}

/**
 * Maps verification/callback errors to user-friendly Spanish messages.
 */
export function getVerificationErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("expired") ||
      msg.includes("invalid") ||
      msg.includes("already been used")
    ) {
      return "El enlace de verificación expiró o ya fue usado. Inicia sesión o solicita un nuevo correo.";
    }
    if (msg.includes("fetch") || msg.includes("network")) {
      return "Error de conexión. Revisa tu internet e intenta de nuevo.";
    }
  }

  if (isAuthApiError(error)) {
    const authError = error as { code?: string };
    if (
      authError.code === "exchange_code_not_found" ||
      authError.code === "invalid_grant"
    ) {
      return "El enlace de verificación expiró o ya fue usado. Inicia sesión o solicita un nuevo correo.";
    }
    if (error.status >= 500) {
      return "Error del servidor. Intenta de nuevo más tarde.";
    }
  }

  return "No pudimos verificar tu correo. Intenta de nuevo.";
}

/**
 * Maps forgot/reset password errors to user-friendly Spanish messages.
 */
export function getResetPasswordErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("expired") ||
      msg.includes("invalid") ||
      msg.includes("already been used")
    ) {
      return "El enlace expiró o ya fue usado. Solicita un nuevo enlace para restablecer tu contraseña.";
    }
    if (msg.includes("fetch") || msg.includes("network")) {
      return "Error de conexión. Revisa tu internet e intenta de nuevo.";
    }
  }

  if (isAuthApiError(error)) {
    const authError = error as { code?: string };
    if (
      authError.code === "exchange_code_not_found" ||
      authError.code === "invalid_grant"
    ) {
      return "El enlace expiró o ya fue usado. Solicita un nuevo enlace para restablecer tu contraseña.";
    }
    if (error.status === 429) {
      return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
    }
    if (error.status >= 500) {
      return "Error del servidor. Intenta de nuevo más tarde.";
    }
  }

  return "Ocurrió un error. Intenta de nuevo.";
}
