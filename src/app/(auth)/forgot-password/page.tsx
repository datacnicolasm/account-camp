import { BrandMark } from "@/components/brand/BrandMark";
import { FadeIn } from "@/components/motion/FadeIn";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <BrandMark compact />

      <FadeIn duration={0.35} y={10}>
        <div className="rounded-2xl border border-border bg-background p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Restablecer contraseña
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu
              contraseña
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </FadeIn>
    </div>
  );
}
