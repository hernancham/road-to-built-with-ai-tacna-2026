import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md px-4 py-12">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-primary text-primary-foreground mb-4 font-bold text-xl">
            G
          </div>
          <p className="text-sm text-muted-foreground">GDG Tacna · Built with AI 2026</p>
        </div>

        {children}
      </div>
    </div>
  );
}
