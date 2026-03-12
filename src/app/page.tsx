import { AppShell } from "@/components/AppShell";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <AppShell title="Home" xp={1250}>
            <main className="flex-1 flex flex-col bg-bone-white">
                {/* Hero Section */}
                <section className="px-6 py-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="font-inter font-semibold text-accent-green uppercase tracking-wider text-[10px]">
                            Praxis 5165 Prep
                        </span>
                        <h1 className="font-playfair font-bold text-[32px] text-pine-dark leading-tight">
                            Master Your <br />
                            <span className="font-playfair italic">Mathematics-for-Teaching</span>
                        </h1>
                    </div>

                    {/* Action Button */}
                    <Link href="/onboarding" className="bg-pine-green text-bone-white py-4 px-6 rounded-[12px] font-inter font-bold text-[16px] flex items-center justify-between group hover:bg-pine-dark transition-all duration-300 shadow-lg active:scale-[0.98]">
                        <span>Begin Diagnostic</span>
                        <div className="bg-bone-white/10 p-1 rounded-full group-hover:bg-bone-white/20 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </Link>
                </section>

                {/* Decorative Blur Element */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-green/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
            </main>
        </AppShell>
    );
}
