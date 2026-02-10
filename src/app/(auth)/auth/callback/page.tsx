"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { BrandMark } from "@/components/brand/BrandMark";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getVerificationErrorMessage } from "@/lib/auth-errors";

const VERIFY_TIMEOUT_MS = 10_000;
const SUCCESS_DELAY_MS = 1_200;

type CallbackState =
  | "idle"
  | "verifying"
  | "success"
  | "error"
  | "timeout"
  | "missing_code";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<CallbackState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasStarted = useRef(false);

  const code = searchParams.get("code");

  useEffect(() => {
    if (hasStarted.current) return;

    if (!code || code.trim() === "") {
      setState("missing_code");
      return;
    }

    hasStarted.current = true;
    setState("verifying");

    const timeoutId = setTimeout(() => {
      setState((prev) => (prev === "verifying" ? "timeout" : prev));
    }, VERIFY_TIMEOUT_MS);

    const supabase = createClient();

    // Use getSession() instead of exchangeCodeForSession() because the Supabase
    // client has detectSessionInUrl: true and auto-exchanges the code when the
    // auth state is first accessed. Calling exchangeCodeForSession manually
    // would cause a duplicate exchange (code already used) and show an error
    // despite successful verification.
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeoutId);

        if (session) {
          setState("success");
          setTimeout(() => {
            router.replace("/student");
            router.refresh();
          }, SUCCESS_DELAY_MS);
        } else {
          setErrorMessage(
            "No pudimos verificar tu correo. Intenta de nuevo o solicita un nuevo enlace."
          );
          setState("error");
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        setErrorMessage(getVerificationErrorMessage(err));
        setState("error");
      });
  }, [code, router]);

  const isErrorState = state === "error" || state === "missing_code";
  const isTimeoutState = state === "timeout";

  return (
    <div className="w-full max-w-md mx-auto">
      <BrandMark compact />

      <FadeIn duration={0.35} y={10}>
        <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              {state === "success"
                ? "¡Listo!"
                : isErrorState || isTimeoutState
                  ? "Verificación"
                  : "Verificando tu correo…"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {state === "success"
                ? "Entrando…"
                : state === "missing_code"
                  ? "No encontramos un código de verificación válido."
                  : isErrorState && errorMessage
                    ? errorMessage
                    : isTimeoutState
                      ? "Esto está tardando más de lo normal…"
                      : "Un momento, por favor."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {(state === "verifying" || state === "success") && (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-4"
              >
                {state === "verifying" ? (
                  <Loader2
                    className="h-10 w-10 animate-spin text-primary"
                    aria-hidden="true"
                  />
                ) : (
                  <motion.div
                    className="h-1 w-full rounded-full bg-muted overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {(isErrorState || isTimeoutState) && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {state === "error" && errorMessage && (
                  <div
                    className="rounded-md border border-destructive/50 bg-destructive/30 px-3 py-2 text-sm text-destructive"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href="/login">Volver a iniciar sesión</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/register">Crear cuenta</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>
    </div>
  );
}

function CallbackFallback() {
  return (
    <div className="w-full max-w-md mx-auto">
      <BrandMark compact />
      <FadeIn duration={0.35} y={10}>
        <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
