"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Chat } from "@/components/chat";
import { ModeToggle } from "@/components/theme-toggle";
import { signOut } from "@/lib/supabase/auth-actions";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ChatPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(routes.redirects.unauthenticated);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Cargando…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top nav */}
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-semibold">Chat IA</h1>
          <nav className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
            <Link
              href={routes.app.profile}
              className="hover:text-foreground transition-colors"
            >
              Perfil
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm px-3 py-1.5 rounded-md border hover:bg-muted transition-colors cursor-pointer"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      {/* Chat ocupa el resto de la pantalla */}
      <div className="flex-1 min-h-0">
        <Chat />
      </div>
    </div>
  );
}
