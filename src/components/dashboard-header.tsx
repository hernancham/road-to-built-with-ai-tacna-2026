import Link from "next/link";

interface HeaderProps {
  user?: { fullName: string; avatar_url?: string };
}

export function DashboardHeader({ user }: HeaderProps) {
  return (
    <header className="flex justify-between items-center w-full px-6 py-4 max-w-none bg-background-dashboard dark:bg-slate-950 fixed top-0 right-0 left-64 z-30 border-b border-outline-variant/10 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-primary-brand dark:text-blue-400">health_and_safety</span>
        <h2 className="font-headline font-bold text-2xl tracking-tight text-primary-brand dark:text-blue-400">GoodPills</h2>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-8">
          <Link href="/dashboard" className="text-primary-brand dark:text-blue-400 border-b-2 border-primary-brand pb-1 font-bold transition-colors duration-200">Dashboard</Link>

        </nav>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container-high flex items-center justify-center">
          {user?.avatar_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img className="w-full h-full object-cover" alt={user.fullName} src={user.avatar_url} />
          ) : (
            <span className="font-bold text-primary-brand text-sm">{user?.fullName?.charAt(0) || "U"}</span>
          )}
        </div>
      </div>
    </header>
  );
}
