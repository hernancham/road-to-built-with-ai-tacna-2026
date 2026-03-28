import { DrugChecker } from "@/components/drug-checker";
import { Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans pb-16">
      {/* Header Mockup */}
      <header className="bg-white dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900 py-4 mb-8 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-600 dark:text-pink-500 font-black text-2xl tracking-tighter">
            <Stethoscope className="w-7 h-7" />
            <span>MedCheck.ai</span>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 mt-6">
          <nav className="flex gap-8 text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest cursor-pointer mt-1">
            <span className="text-pink-600 dark:text-pink-500 border-b-[3px] border-pink-600 pb-3 -mb-[3px]">Drug Interactions</span>
            <span className="pb-3 -mb-[3px] hover:text-gray-600 transition-colors">Food Interactions</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 flex flex-col items-center w-full">
        <DrugChecker />
      </main>
    </div>
  );
}
