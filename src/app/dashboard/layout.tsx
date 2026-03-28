import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-dashboard font-body text-on-background-dashboard min-h-screen flex flex-row dark:bg-slate-950 dark:text-slate-100">
      <DashboardSidebar currentPortal="pharmacy" />
      <main className="ml-[16rem] flex-1 p-8 flex flex-col min-w-0">
        <DashboardHeader />
        <div className="mt-20">
          {children}
        </div>
      </main>
    </div>
  );
}
