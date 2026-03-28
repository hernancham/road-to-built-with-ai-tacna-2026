/**
 * routes.ts — Declaración centralizada de rutas y redirecciones
 *
 * Uso:
 *   import { routes } from "@/lib/routes"
 *   redirect(routes.auth.login)
 *   redirect(routes.redirects.afterSignIn)
 */

// ─── Rutas de la app ──────────────────────────────────────────────────────────

export const routes = {
  // Página principal
  home: "/",

  // Autenticación
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    updatePassword: "/update-password",
    /** Callback de OAuth / magic link (route handler interno) */
    callback: "/auth/callback",
  },

  // App protegida
  app: {
    /**
     * Dashboard principal.
     * TODO: cambiar a "/dashboard" cuando exista la página.
     */
    dashboard: "/profile",
    profile: "/profile",
    chat: "/chat",
  },

  // ─── Redirecciones semánticas ───────────────────────────────────────────────
  redirects: {
    /** A dónde ir tras iniciar sesión / registrarse */
    afterSignIn: "/profile",
    /** A dónde ir tras cerrar sesión */
    afterSignOut: "/login",
    /** A dónde ir si el usuario no está autenticado */
    unauthenticated: "/login",
    /** A dónde ir si el usuario ya está autenticado y visita /login */
    authenticated: "/profile",
  },
} as const;

// Tipo utilitario por si necesitas tipar rutas en algún componente
export type AppRoute = (typeof routes)[keyof typeof routes];
