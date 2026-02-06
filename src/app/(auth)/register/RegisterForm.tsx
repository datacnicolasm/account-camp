"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { getSignUpErrorMessage } from "@/lib/auth-errors";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "El nombre completo es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z
      .string()
      .min(1, "El correo electrónico es obligatorio")
      .email("Ingresa un correo electrónico válido"),
    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const fullName = watch("fullName");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const isFormValid =
    isValid &&
    fullName?.trim() &&
    email?.trim() &&
    password?.trim() &&
    confirmPassword?.trim();
  const isSubmitDisabled = isLoading || !isFormValid;

  function getEmailRedirectTo(): string {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return base ? `${base}/auth/callback` : "";
  }

  async function onSubmit(data: RegisterFormValues) {
    setAuthError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const emailRedirectTo = getEmailRedirectTo();

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
          emailRedirectTo: emailRedirectTo || undefined,
        },
      });

      if (error) {
        setAuthError(getSignUpErrorMessage(error));
        return;
      }

      if (signUpData.user?.identities?.length === 0) {
        setAuthError(
          "Este correo ya está registrado. Inicia sesión o restablece tu contraseña."
        );
        return;
      }

      setSuccess(true);
    } catch (err) {
      setAuthError(getSignUpErrorMessage(err));
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
          Revisa tu correo para verificar tu cuenta.
        </div>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-medium text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
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
        <Label htmlFor="fullName">Nombre completo</Label>
        <div className="relative">
          <User
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="fullName"
            type="text"
            placeholder="Tu nombre"
            className="h-11 pl-10"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
        </div>
        <div className="min-h-[1.25rem]">
          {errors.fullName && (
            <p
              id="fullName-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.fullName.message}
            </p>
          )}
        </div>
      </div>

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

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-11 pl-10 pr-10 bg-background"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "password-error" : undefined
            }
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="min-h-[1.25rem]">
          {errors.password && (
            <p
              id="password-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Repetir contraseña</Label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-11 pl-10 pr-10 bg-background"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            {...register("confirmPassword")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={
              showConfirmPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="min-h-[1.25rem]">
          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.confirmPassword.message}
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
            Creando cuenta…
          </>
        ) : (
          "Crear cuenta"
        )}
      </Button>

      <div className="mt-2 space-y-1">
        <p className="text-center text-sm text-muted-foreground">
          {"¿Ya tienes cuenta? "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Inicia sesión
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/forgot-password"
            className="text-accent hover:text-accent/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Restablecer contraseña
          </Link>
        </p>
      </div>
    </form>
  );
}
