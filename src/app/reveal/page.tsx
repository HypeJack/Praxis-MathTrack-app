"use client";

import Link from "next/link";
import Image from "next/image";
import MathTrackLogo from "@/assets/logo.png";
import { User, Sparkles } from "lucide-react";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { TriadTriangle } from "@/components/TriadTriangle";
import { PERSONA_DATA } from "@/data/personas";

export default function RevealPage() {
    const { isComplete, triadPosition, persona: personaKey } = useDiagnosticStore();
    const persona = personaKey ? PERSONA_DATA[personaKey] : null;

    return (
        <main className="w-full min-h-[100dvh] bg-bone-white flex flex-col font-inter">
            {/* Step 1: Standard Top Nav Bar */}
            <header className="bg-pine-green w-full z-20 shadow-sm relative">
                <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
                    <Image src={MathTrackLogo} alt="MathTrack Logo" width={140} height={30} className="h-7 w-auto object-contain" />
                    <div className="flex items-center space-x-3">
                        <Link href="/profile" className="hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-bone-white/20 flex items-center justify-center">
                                <User size={18} className="text-bone-white" />
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Areas */}
            <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto mt-12 px-6">

                {/* Step 2: Typography & Content */}
                <h1 className="font-playfair font-bold text-[32px] text-pine-green mb-4 leading-tight">
                    {persona ? "Your Pedagogical Profile" : "Analyzing your pedagogical profile..."}
                </h1>

                {!persona ? (
                    <p className="font-inter text-[17px] text-gray-700 mb-8 leading-relaxed">
                        To master the Praxis 5165, you need more than just computation skills. We evaluate your data across four distinct pillars to assign you one of our MathTrack Personas.
                    </p>
                ) : (
                    <div className="space-y-8 pb-12">
                        {/* Triad Visualization */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <TriadTriangle position={triadPosition!} />
                        </div>

                        {/* Persona Reveal */}
                        <div className="bg-pine-dark text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl">{persona.icon}</span>
                                    <div>
                                        <h2 className="text-[24px] font-playfair font-bold">{persona.name}</h2>
                                        <p className="text-accent-gold text-[12px] font-bold uppercase tracking-widest">Mastery Persona</p>
                                    </div>
                                </div>
                                <p className="text-[18px] font-medium leading-tight mb-6 italic text-white/90">
                                    "{persona.tagline}"
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">Core Strength</h4>
                                        <p className="text-[14px] leading-relaxed">{persona.strength}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">Focus Area</h4>
                                        <p className="text-[14px] leading-relaxed">{persona.focusArea}</p>
                                    </div>
                                </div>
                            </div>
                            <Sparkles className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48" />
                        </div>

                        <div className="space-y-4 pt-4">
                             <div className="bg-white border-2 border-pine-green/20 rounded-2xl p-6">
                                <h4 className="font-bold text-pine-green flex items-center gap-2 mb-2">
                                    <Sparkles size={18} />
                                    Your Learning Strategy
                                </h4>
                                <p className="text-[15px] text-gray-700 leading-relaxed">
                                    {persona.strategy}
                                </p>
                            </div>

                            <Link
                                href="/dashboard"
                                className="w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-lg transition-all duration-200 active:scale-[0.98] hover:bg-pine-dark/90"
                            >
                                Enter My Roadmap &rarr;
                            </Link>
                        </div>
                    </div>
                )}

                {!persona && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Static Info Cards */}
                            <div className="bg-white border border-gray-200 rounded-[12px] p-5 shadow-sm opacity-50">
                                <h3 className="font-inter font-bold text-[16px] text-pine-dark flex items-center mb-2">
                                    <span className="text-xl mr-2">🦉</span> Stealth Scholar
                                </h3>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-[12px] p-5 shadow-sm opacity-50">
                                <h3 className="font-inter font-bold text-[16px] text-pine-dark flex items-center mb-2">
                                    <span className="text-xl mr-2">🎤</span> Math Narrator
                                </h3>
                            </div>
                        </div>

                        <div className="mt-12 pb-12">
                            <button
                                onClick={() => useDiagnosticStore.getState().completeDiagnostic()}
                                className="w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-lg transition-all duration-200 active:scale-[0.98] hover:bg-pine-dark/90"
                            >
                                Calculate My Results &rarr;
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
