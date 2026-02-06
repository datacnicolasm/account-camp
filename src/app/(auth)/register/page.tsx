import Link from "next/link";

import { BrandMark } from "@/components/brand/BrandMark";
import { FadeIn } from "@/components/motion/FadeIn";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <BrandMark compact />

      <FadeIn duration={0.35} y={10}>
        <div className="rounded-2xl border border-border bg-background p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Crea tu cuenta
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Completa el formulario para registrarte
            </p>
          </div>

          <RegisterForm />

          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground/70">
            Al registrarte, aceptas los{" "}
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
