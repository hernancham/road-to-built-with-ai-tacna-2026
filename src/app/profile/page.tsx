"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { ModeToggle } from "@/components/theme-toggle";
import { signOut } from "@/lib/supabase/auth-actions";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Mi Perfil</h1>
          <ModeToggle />
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm px-4 py-2 rounded-md bg-destructive text-white hover:bg-destructive/90 transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Avatar + nombre */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shrink-0 select-none">
            {initials}
          </div>
          <div>
            <p className="text-2xl font-bold">
              {meta.full_name ?? "Usuario"}
            </p>
            <p className="text-muted-foreground">{user.email}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {user.role ?? "authenticated"}
            </span>
          </div>
        </div>

        {/* Información del usuario */}
        <section className="rounded-xl border bg-card p-6 space-y-1">
          <h2 className="text-base font-semibold mb-4">
            Información de la cuenta
          </h2>
          <dl className="divide-y">
            {fields.map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-[180px_1fr] py-3 gap-4 items-start"
              >
                <dt className="text-sm text-muted-foreground font-medium">
                  {label}
                </dt>
                <dd className="text-sm font-mono break-all">
                  {value ?? <span className="text-muted-foreground">—</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Token de sesión (debug) */}
        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-base font-semibold mb-4">
            Token de sesión{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (debug)
            </span>
          </h2>
          <textarea
            readOnly
            rows={5}
            value={session?.access_token ?? ""}
            className="w-full text-xs font-mono bg-muted rounded-md p-3 resize-none border border-border focus:outline-none"
            id="access-token"
            aria-label="JWT access token"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Expira:{" "}
            {session?.expires_at
              ? new Date(session.expires_at * 1000).toLocaleString("es-PE")
              : "—"}
          </p>
        </section>
      </main>
    </div>
  );
}
