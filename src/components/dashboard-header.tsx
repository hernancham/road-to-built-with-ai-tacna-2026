import Link from "next/link";

export function DashboardHeader() {
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
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
          <img className="w-full h-full object-cover" alt="Pharmacist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrVn7FKCBoN_zy2KRvMayyy0EELavHqLGitLJuhqb1LmEqRFLOF-GRTSmHTUq9oJ0hDIKCBLxl1mrt5TQ2UarYHBiR0b_mMgywKiWzQudU_jnE79yL_A7w7cz3ihtbqTwAsSuiwzaSH5CV_uwjMdugEJMSLGXBNDr1w9W1qA8e-m5p8jDxVhx8JbzAnm_KrWp2167qVIXymYrIAAZ0OMeNKPMiQYAfHhStn1etspANciSyrD_xDZ6lwe69BfGttzMaC-GoWxAbUo68" />
        </div>
      </div>
    </header>
  );
}
