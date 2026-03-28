import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userProfile = {
    fullName: user?.user_metadata?.full_name || user?.email || "Administrador",
    dni: user?.user_metadata?.dni || "",
    avatar_url: user?.user_metadata?.avatar_url || "",
  };

  return (
    <div className="bg-background-dashboard font-body text-on-background-dashboard min-h-screen flex flex-row dark:bg-slate-950 dark:text-slate-100">
      <DashboardSidebar currentPortal="pharmacy" user={userProfile} />
      <main className="ml-64 flex-1 p-8 flex flex-col min-w-0">
        <DashboardHeader user={userProfile} />
        <div className="mt-20">
          {children}
        </div>
      </main>
    </div>
  );
}
