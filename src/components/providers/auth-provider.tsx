"use client";

/**
 * AuthProvider — Proveedor global de autenticación con Supabase
 *
 * Características:
 * - Sesión en tiempo real vía onAuthStateChange (single source of truth)
 * - isLoading correcto: true hasta que INITIAL_SESSION dispare
 * - Supabase client estable via useRef (evita re-creaciones)
 * - useEffect con [] para suscribirse una sola vez
 * - Hook useAuth() con guard de contexto nulo real
 */

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

// Tipos
export interface AuthContextType {
  /** true mientras se resuelve la sesión inicial */
  isLoading: boolean;
  /** true si hay sesión activa */
  isAuthenticated: boolean;
  /** Sesión de Supabase Auth */
  session: Session | null;
  /** Usuario de Supabase Auth */
  user: User | null;
}

// Contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Instancia estable del cliente — no se re-crea en cada render
  const supabaseRef = useRef(createClient());

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = supabaseRef.current;

    // onAuthStateChange es la única fuente de verdad.
    // El evento INITIAL_SESSION se dispara automáticamente al suscribirse,
    // por lo que no necesitamos llamar getSession() por separado.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      switch (event) {
        case "INITIAL_SESSION": {
          // La sesión inicial ya llegó — dejamos de mostrar loading
          setIsLoading(false);
          break;
        }

        case "PASSWORD_RECOVERY": {
          // Ignorar la sesión temporal de recuperación de contraseña
          void supabase.auth.signOut();
          setUser(null);
          setSession(null);
          break;
        }

        case "SIGNED_OUT": {
          setUser(null);
          setSession(null);
          break;
        }

        // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED:
        // La sesión/usuario ya vienen en newSession — sin llamadas extra
        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, []); // [] → suscribirse una sola vez al montar

  // Memorizar el valor para evitar re-renders innecesarios en consumidores
  const value = useMemo<AuthContextType>(
    () => ({
      isLoading,
      isAuthenticated: !isLoading && session !== null,
      session,
      user,
    }),
    [isLoading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
