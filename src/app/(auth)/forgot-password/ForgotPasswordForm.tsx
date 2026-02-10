"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresa un correo electrónico válido"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const email = watch("email");
  const isFormValid = isValid && email?.trim();
  const isSubmitDisabled = isLoading || !isFormValid;

  function getRedirectTo(): string {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return base ? `${base}/reset-password` : "";
  }

  async function onSubmit(data: ForgotPasswordFormValues) {
    setAuthError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const redirectTo = getRedirectTo();

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectTo || undefined,
      });

      if (error) {
        setAuthError(getAuthErrorMessage(error));
        return;
      }

      setSuccess(true);
    } catch (err) {
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4">
        <div
          className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground"
          role="status"
        >
          Si el correo existe, te enviaremos un enlace para restablecer tu
          contraseña.
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/login">Volver a iniciar sesión</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/register">Crear cuenta</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      {authError && (
        <div
          className="rounded-md border border-destructive/50 bg-destructive/30 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {authError}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            className="h-11 pl-10"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </div>
        <div className="min-h-[1.25rem]">
          {errors.email && (
            <p
              id="email-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 w-full font-medium"
        disabled={isSubmitDisabled}
      >
        {isLoading ? (
          <>
            <Loader2
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
            Enviando…
          </>
        ) : (
          "Enviar enlace"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {"¿Ya tienes cuenta? "}
        <Link
          href="/login"
          className="font-medium text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Volver a iniciar sesión
        </Link>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        {"¿No tienes cuenta? "}
        <Link
          href="/register"
          className="font-medium text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
