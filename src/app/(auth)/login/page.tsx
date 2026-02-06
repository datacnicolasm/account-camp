"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BrandMark } from "@/components/brand/BrandMark";
import { FadeIn } from "@/components/motion/FadeIn";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const isFormValid = isValid && email?.trim() && password?.trim();
  const isSubmitDisabled = isLoading || !isFormValid;

  async function onSubmit(data: LoginFormValues) {
    setAuthError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setAuthError(getAuthErrorMessage(error));
        return;
      }

      router.push("/student");
      router.refresh();
    } catch (err) {
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <BrandMark />

      <FadeIn duration={0.35} y={10}>
        <div className="rounded-2xl border border-border bg-background p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Bienvenido de vuelta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inicia sesión para continuar
          </p>
        </div>

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

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-accent hover:text-accent/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Restablecer contraseña
              </Link>
            </div>
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
                autoComplete="current-password"
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

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setRememberMe(checked === true)
              }
              aria-label="Recordarme"
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal text-muted-foreground cursor-pointer"
            >
              Recordarme
            </Label>
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
                Ingresando…
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {"¿No tienes cuenta? "}
          <Link
            href="/register"
            className="font-medium text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Crear cuenta
          </Link>
        </p>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground/70">
          Al iniciar sesión, aceptas los{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Términos de uso
          </Link>{" "}
          y la{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Política de privacidad
          </Link>
          .
        </p>
        </div>
      </FadeIn>
    </div>
  );
}
