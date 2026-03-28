import Link from "next/link";

interface SidebarProps {
  currentPortal: 'patient' | 'pharmacy';
  user?: {
    fullName: string;
    dni: string;
    avatar_url?: string;
  };
}

import { signOut } from "@/lib/supabase/auth-actions";

export function DashboardSidebar({ currentPortal, user }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col bg-surface-container-low dark:bg-slate-900 w-64 rounded-r-xl shadow-2xl shadow-blue-900/10 z-40">
      <div className="px-6 py-8">
        <h1 className="font-headline text-2xl text-primary-brand dark:text-blue-200 font-bold">FarmaGuard</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {/* Inactive Tab */}
        <Link
          className={`flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition-all ${
            currentPortal === 'patient'
              ? 'bg-primary-container text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-headline text-sm tracking-wide uppercase">Portal del Paciente</span>
        </Link>
        {/* Active Tab */}
        <Link
          className={`flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition-all ${
            currentPortal === 'pharmacy'
              ? 'bg-primary-container text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800'
          }`}
          href="/dashboard"
        >
          <span className="material-symbols-outlined">local_pharmacy</span>
          <span className="font-headline text-sm tracking-wide uppercase font-bold">Portal de Farmacia</span>
        </Link>
      </nav>
      <div className="p-6 mt-auto">
        <div className="bg-surface-container-lowest dark:bg-slate-800 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-label text-outline uppercase tracking-widest mb-2">Usuario Actual</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white overflow-hidden">
              {user?.avatar_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={user.avatar_url} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                  <span className="material-symbols-outlined text-sm">medical_services</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-on-surface dark:text-white truncate" title={user?.fullName || "Administrador"}>
                {user?.fullName || "Administrador"}
              </p>
              <p className="text-[10px] text-on-surface-variant dark:text-slate-400 truncate">
                {user?.dni ? `DNI: ${user.dni}` : "Farmacéutico"}
              </p>
            </div>
          </div>
          <form action={signOut} className="mt-4 pt-3 border-t border-outline-variant/10 dark:border-slate-700">
              <button title="Cerrar sesión" type="submit" className="w-full flex items-center gap-2 justify-center text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Cerrar Sesión
              </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
