"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { ModeToggle } from "@/components/theme-toggle";
import { signOut } from "@/lib/supabase/auth-actions";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, session, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirigir a login si no hay sesión (una vez que se resolvió el loading)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(routes.redirects.unauthenticated);
    }
  }, [isLoading, isAuthenticated, router]);

  /* ── Loading state ──────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Cargando sesión…</p>
        </div>
      </div>
    );
  }

  /* ── Not authenticated (transitioning) ─────────────────────────────────── */
  if (!isAuthenticated || !user) {
    return null;
  }

  /* ── Helpers ─────────────────────────────────────────────────────────────── */
  const meta = user.user_metadata as Record<string, string>;
  const initials = (meta.full_name ?? user.email ?? "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const fields: { label: string; value: string | undefined }[] = [
    { label: "Email", value: user.email },
    { label: "Nombre completo", value: meta.full_name },
    { label: "DNI", value: meta.dni },
    { label: "Teléfono", value: meta.phone },
    { label: "ID de usuario", value: user.id },
    {
      label: "Cuenta creada",
      value: new Date(user.created_at).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    },
    {
      label: "Último inicio de sesión",
      value: user.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleString("es-PE")
        : "—",
    },
    {
      label: "Email confirmado",
      value: user.email_confirmed_at ? "✅ Sí" : "❌ No",
    },
  ];

  /* ── UI ─────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background-dashboard text-on-background-dashboard font-sans">
      {/* Branded Header */}
      <header className="bg-background-dashboard fixed top-0 logged-in z-50 flex justify-between items-center w-full px-6 py-4 border-b border-surface-container shadow-sm">
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary-container text-3xl">health_and_safety</span>
          <span className="text-primary-brand font-extrabold tracking-tighter text-2xl font-headline">GoodPills</span>
        </Link>
        <div className="flex items-center gap-4">
            <ModeToggle />
            <form action={signOut}>
                <button
                type="submit"
                className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all cursor-pointer border border-error/20"
                >
                Salir
                </button>
            </form>
        </div>
      </header>

      <div className="h-24" /> {/* Spacer for fixed header */}

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Profile Card Header */}
        <div className="relative group p-8 rounded-[2.5rem] bg-linear-to-br from-primary-brand/5 to-secondary-container/10 border border-white overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-9xl">account_circle</span>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 rounded-3xl bg-primary-brand text-white flex items-center justify-center text-4xl font-bold font-headline shadow-xl shadow-primary-brand/20 ring-4 ring-white">
              {initials}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-extrabold font-headline text-primary-brand tracking-tight mb-1">
                {meta.full_name ?? "Usuario"}
              </h2>
              <p className="text-on-surface-variant/80 font-medium mb-4">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-4 py-1.5 rounded-full bg-primary-brand text-white text-[10px] font-bold uppercase tracking-widest">
                  Paciente Verificado
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white text-on-surface-variant text-[10px] font-bold uppercase tracking-widest border border-outline-variant/30">
                  ID: {user.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {/* Información Personal */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                    <span className="material-symbols-outlined text-primary-brand">badge</span>
                    <h3 className="text-lg font-bold font-headline text-on-surface tracking-tight">Información de la Cuenta</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.slice(0, 4).map(({ label, value }) => (
                    <div key={label} className="p-5 rounded-3xl bg-white/50 border border-white shadow-sm hover:shadow-md transition-shadow">
                        <dt className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">
                        {label}
                        </dt>
                        <dd className="font-bold text-on-surface truncate">
                        {value ?? "—"}
                        </dd>
                    </div>
                    ))}
                </div>
            </section>

            {/* Detalles Técnicos */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                    <span className="material-symbols-outlined text-primary-brand">monitoring</span>
                    <h3 className="text-lg font-bold font-headline text-on-surface tracking-tight">Actividad y Seguridad</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.slice(4).map(({ label, value }) => (
                    <div key={label} className="p-5 rounded-3xl bg-white/50 border border-white shadow-sm">
                        <dt className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">
                        {label}
                        </dt>
                        <dd className="text-xs font-bold text-on-surface-variant">
                        {value ?? "—"}
                        </dd>
                    </div>
                    ))}
                </div>
            </section>
        </div>

        {/* Token Area */}
        <section className="space-y-4">
            <button 
                onClick={() => {
                    const el = document.getElementById('token-container');
                    el?.classList.toggle('hidden');
                }}
                className="text-xs font-bold text-primary-brand/60 hover:text-primary-brand transition-colors cursor-pointer uppercase tracking-tighter"
            >
                Ver Session Token (Debug)
            </button>
            <div id="token-container" className="hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-6 rounded-[2rem] bg-inverse-surface text-inverse-on-surface shadow-2xl relative">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">JWT Access Token</span>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Sesión Activa
                        </div>
                    </div>
                    <textarea
                        readOnly
                        rows={4}
                        value={session?.access_token ?? ""}
                        className="w-full text-[10px] font-mono bg-white/5 rounded-2xl p-4 resize-none focus:outline-none border border-white/10"
                        aria-label="JWT access token"
                    />
                    <p className="text-[10px] font-bold opacity-40 mt-4 text-center">
                        EXPIRACIÓN: {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : "—"}
                    </p>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
