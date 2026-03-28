import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-dashboard relative overflow-hidden font-sans">
      {/* Fondo decorativo con colores de la marca */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-125 h-125 rounded-full bg-primary-container/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-125 h-125 rounded-full bg-secondary-container/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md px-4 py-8">
        {/* Logo / Branding */}
        <Link href="/" className="flex flex-col items-center text-center mb-10 group transition-transform active:scale-95">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary-container text-5xl">health_and_safety</span>
            <span className="text-primary-brand font-extrabold tracking-tighter text-4xl font-headline">GoodPills</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Built with AI · GDG Tacna 2026</p>
        </Link>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </div>
    </div>
  );
}
