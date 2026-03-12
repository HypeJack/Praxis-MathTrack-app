"use client";

import Link from "next/link";
import Image from "next/image";
import MathTrackLogo from "@/assets/logo.png";
import { User, Check, Circle, AlertCircle, Play, BarChart3, TrendingUp, ChevronRight } from "lucide-react";
import { useDiagnosticStore, DomainKey } from "@/store/diagnosticStore";
import { PERSONA_DATA } from "@/data/personas";
import { TriadTriangle } from "@/components/TriadTriangle";

export default function Dashboard() {
    const { triadPosition, persona: personaKey, isComplete, scores } = useDiagnosticStore();
    const persona = personaKey ? PERSONA_DATA[personaKey] : {
        name: "Stealth Scholar",
        icon: "🦉",
        tagline: "You think like a mathematician. Now let's find the words to match.",
    };

    const getDomainStyle = (strength: string) => {
        switch (strength) {
            case "High": return "bg-green-50 border-green-200";
            case "Mid": return "bg-yellow-50 border-yellow-200";
            case "Growth Area": return "bg-orange-50 border-orange-200";
            default: return "bg-gray-50 border-gray-200";
        }
    };

    const getDomainIndicator = (strength: string) => {
        switch (strength) {
            case "High":
                return (
                    <div className="flex items-center space-x-1 text-pine-green font-bold text-[12px]">
                        <Check size={16} strokeWidth={3} />
                        <span>High</span>
                    </div>
                );
            case "Mid":
                return (
                    <div className="flex items-center space-x-1 text-accent-gold font-bold text-[12px]">
                        <Circle size={14} strokeWidth={3} />
                        <span>Mid</span>
                    </div>
                );
            case "Growth Area":
                return (
                    <div className="flex items-center space-x-1 text-highlight-terracotta font-bold text-[12px]">
                        <AlertCircle size={16} strokeWidth={3} />
                        <span>Growth Area</span>
                    </div>
                );
            default:
                return null;
        }
    };

    // Helper to determine strength based on scores
    const getStrengthLabel = (domainKey: DomainKey) => {
        const score = scores[domainKey];
        if (!score) return "Growth Area";
        const avg = ((score.computation ?? 0) + (score.receptiveLiteracy ?? 0) + (score.expressiveLiteracy ?? 0)) / 3;
        if (avg >= 2.5) return "High";
        if (avg >= 1.5) return "Mid";
        return "Growth Area";
    };

    const domains = [
        { name: "Stats & Probability", strength: getStrengthLabel('iv') },
        { name: "Functions & Calculus", strength: getStrengthLabel('ii') },
        { name: "Geometry", strength: getStrengthLabel('iii') },
        { name: "Algebra", strength: getStrengthLabel('ib') },
        { name: "Number & Quantity", strength: getStrengthLabel('ia') }
    ];

    if (!isComplete || !triadPosition) {
        return (
            <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col items-center justify-center bg-bone-white p-6 text-center">
                <h1 className="font-playfair font-bold text-2xl text-pine-green mb-4">Diagnostic Incomplete</h1>
                <p className="text-gray-600 mb-8">Please complete your diagnostic to access your personalized roadmap.</p>
                <Link href="/diagnostic/domain-ia/intro" className="bg-pine-dark text-white px-8 py-3 rounded-xl font-bold">
                    Start Diagnostic
                </Link>
            </main>
        );
    }

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Step 1: Layout & Navigation */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <Image src="/White MathTrack Institute Logo.png" alt="MathTrack Logo" width={140} height={30} className="h-7 w-auto object-contain brightness-0" />
                    <Link href="/profile" className="hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-pine-dark flex items-center justify-center text-white font-inter font-bold text-[14px]">
                            JS
                        </div>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-6 pt-8 pb-32">
                {/* Step 2: Welcome & Performance Summary */}
                <div className="mb-2">
                    <h1 className="font-playfair font-bold text-[30px] text-pine-green leading-tight mb-2">
                        Your Diagnostic Profile
                    </h1>
                </div>

                {/* User Persona Card */}
                <p className="font-inter text-[16px] text-gray-600 mb-6">
                    Based on your performance across the diagnostic, here is your MathTrack Persona.
                </p>
                <div className="bg-pine-green rounded-[16px] p-6 shadow-md mb-10 flex items-center space-x-4">
                    <div className="text-[48px] leading-none shrink-0" aria-hidden="true">
                        {persona.icon}
                    </div>
                    <div className="flex flex-col text-bone-white">
                        <span className="font-playfair font-bold text-[24px] mb-1 leading-tight">
                            {persona.name}
                        </span>
                        <span className="font-inter text-[14px] opacity-90 leading-snug">
                            {persona.tagline}
                        </span>
                    </div>
                </div>

                {/* Step 3: The Triad Triangle */}
                <div className="bg-white rounded-[16px] border border-gray-200 p-8 shadow-sm mb-10 flex flex-col items-center">
                    <h2 className="w-full font-inter font-bold text-[14px] text-pine-dark uppercase tracking-wide mb-6">
                        Pillar Visualization
                    </h2>
                    <TriadTriangle position={triadPosition} animated={false} size={280} />
                </div>

                {/* Step 4: Mastery Map (Grid) */}
                <div className="mb-12">
                    <h2 className="font-inter font-bold text-[14px] text-pine-dark uppercase tracking-wide mb-4">
                        Mastery Map
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {domains.map((domain, index) => (
                            <div
                                key={domain.name}
                                className={`rounded-[12px] border p-4 shadow-sm flex flex-col ${getDomainStyle(domain.strength)} ${index === domains.length - 1 ? 'col-span-2' : ''}`}
                            >
                                <span className="font-inter font-semibold text-[15px] text-pine-dark mb-3 leading-tight">
                                    {domain.name}
                                </span>
                                <div className="mt-auto">
                                    {getDomainIndicator(domain.strength)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 5: Priority Logic State */}
                <div className="mb-12">
                    <h2 className="font-playfair font-bold text-[22px] text-pine-green mb-4">
                        Your Personalized Focus
                    </h2>
                    <div className="flex flex-col space-y-4">

                        {/* Recommendation 1: Top Priority */}
                        <Link href="/lesson/calculus" className="bg-white rounded-[12px] border-[2px] border-highlight-terracotta p-4 shadow-sm relative block hover:scale-[1.02] hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-inter font-bold text-[14px] text-pine-dark flex items-center">
                                    Top Priority: High Impact <Play size={14} className="ml-2 text-highlight-terracotta transition-transform group-hover:translate-x-1" />
                                </span>
                                <span className="bg-gray-100 text-gray-500 font-inter font-bold text-[12px] px-2 py-1 rounded-[6px]">
                                    12 hours
                                </span>
                            </div>
                            <p className="font-inter text-[14px] text-gray-600 leading-relaxed pr-8">
                                Focus on Functions &amp; Calculus. Your literacy score here suggests a need to revisit limit definitions and derivative proofs.
                            </p>
                        </Link>

                        {/* Recommendation 2: Confidence Calibration */}
                        <Link href="/lesson/algebra" className="bg-white rounded-[12px] border-[2px] border-pine-green p-4 shadow-sm relative block hover:scale-[1.02] hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-inter font-bold text-[14px] text-pine-dark flex items-center">
                                    Confidence Calibration <Play size={14} className="ml-2 text-pine-green transition-transform group-hover:translate-x-1" />
                                </span>
                                <span className="bg-gray-100 text-gray-500 font-inter font-bold text-[12px] px-2 py-1 rounded-[6px]">
                                    5 hours
                                </span>
                            </div>
                            <p className="font-inter text-[14px] text-gray-600 leading-relaxed pr-8">
                                Review Algebraic Foundations. You felt confident here, but procedural errors in systems of equations suggest a need for more calculation drills.
                            </p>
                        </Link>

                        {/* Recommendation 3: Quick Win */}
                        <Link href="/lesson/geometry" className="bg-white rounded-[12px] border-[2px] border-pine-green p-4 shadow-sm relative block hover:scale-[1.02] hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-inter font-bold text-[14px] text-pine-dark flex items-center">
                                    Quick Win <Play size={14} className="ml-2 text-pine-green transition-transform group-hover:translate-x-1" />
                                </span>
                                <span className="bg-gray-100 text-gray-500 font-inter font-bold text-[12px] px-2 py-1 rounded-[6px]">
                                    2 hours
                                </span>
                            </div>
                            <p className="font-inter text-[14px] text-gray-600 leading-relaxed pr-8">
                                Boost your Geometry score. You have a great grasp of geometric logic; a few timed practice sets will help your confidence match your skill.
                            </p>
                        </Link>

                    </div>
                </div>

                {/* Step 6: Mastery Gap Analysis */}
                <div className="mb-12">
                    <h2 className="font-inter font-bold text-[14px] text-pine-dark uppercase tracking-wide mb-4">
                        Advanced Analytics
                    </h2>
                    <Link 
                        href="/dashboard/mastery-gap"
                        className="bg-white rounded-[16px] border border-gray-200 p-6 shadow-sm hover:border-pine-green transition-all block group relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                                <BarChart3 size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-pine-dark">Mastery Gap Analysis</h3>
                                <p className="text-[13px] text-gray-500">Compare developmental growth vs. test performance.</p>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-pine-green transition-colors" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Step 4.5: Practice Exams Section */}
            <div className="px-6 mb-12">
                <h2 className="font-inter font-bold text-[14px] text-pine-dark uppercase tracking-wide mb-4">
                    Full Practice Exams
                </h2>
                <div className="space-y-3">
                    <Link 
                        href="/simulator/form-a"
                        className="bg-pine-green text-bone-white rounded-[12px] p-5 flex items-center justify-between shadow-md hover:bg-pine-dark transition-all group"
                    >
                        <div className="flex flex-col">
                            <span className="font-playfair font-bold text-[18px]">Practice Test: Form A</span>
                            <span className="text-[12px] opacity-70">66 Questions • 180 Minutes</span>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full group-hover:bg-accent-gold transition-colors">
                            <Play size={20} className="text-white group-hover:text-pine-dark" />
                        </div>
                    </Link>

                    <div className="grid grid-cols-2 gap-3 opacity-60">
                        <div className="bg-white border border-gray-200 rounded-[12px] p-4 flex flex-col cursor-not-allowed">
                            <span className="font-inter font-bold text-[14px]">Form B</span>
                            <span className="text-[11px] text-gray-400">Locked (Coming Early April)</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-[12px] p-4 flex flex-col cursor-not-allowed">
                            <span className="font-inter font-bold text-[14px]">Form C</span>
                            <span className="text-[11px] text-gray-400">Locked</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
