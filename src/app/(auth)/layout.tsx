export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-navy">
      {/* Grid pattern - white lines on dark background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Animated grid pulse */}
      <div
        className="absolute inset-0 animate-[auth-grid-pulse_8s_ease-in-out_infinite] opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "96px 96px",
        }}
      />

      {/* Floating orbs - brand cyan/mint */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full bg-brand-cyan/20 blur-3xl animate-[auth-float_12s_ease-in-out_infinite]" />
        <div className="absolute top-[70%] right-[15%] w-40 h-40 rounded-full bg-brand-mint/15 blur-3xl animate-[auth-float_15s_ease-in-out_infinite]" style={{ animationDelay: "-3s" }} />
        <div className="absolute bottom-[20%] left-[25%] w-24 h-24 rounded-full bg-brand-cyan/10 blur-2xl animate-[auth-float-slow_20s_ease-in-out_infinite]" style={{ animationDelay: "-5s" }} />
        <div className="absolute top-[40%] right-[30%] w-20 h-20 rounded-full bg-brand-mint/12 blur-2xl animate-[auth-float_14s_ease-in-out_infinite]" style={{ animationDelay: "-7s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
