"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TriadProvider, useTriad } from "./TriadContext";
import triadData from "../../../data/triadData.json";

function SlopeLessonContent({ children }: { children: React.ReactNode }) {
    const { state } = useTriad();
    
    // Find matching scenario or fallback to first one
    const activeScenario = triadData.find(s => s.id === state.activeScenarioId) || triadData[0];
    const comp = activeScenario.computation;

    return (
        <div className="min-h-screen bg-bone-white font-inter flex flex-col">
            {/* Top Nav */}
            <header className="w-full bg-pine-green flex items-center justify-between px-6 py-4 sticky top-0 z-50 shadow-sm"
                style={{
                    paddingTop: "max(1rem, env(safe-area-inset-top))"
                }}
            >
                <div className="flex items-center">
                    <Image
                        src="/White MathTrack Institute Logo.png"
                        alt="MathTrack Institute"
                        width={150}
                        height={28}
                        className="h-7 w-auto object-contain"
                        priority
                    />
                </div>
                <div className="flex items-center gap-4">
                    {/* Back to Roadmap */}
                    <Link 
                        href={`/domain/${activeScenario.domain.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`}
                        className="hidden md:flex items-center gap-2 text-bone-white/80 hover:text-bone-white font-inter text-[14px] font-medium transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        Roadmap
                    </Link>

                    {/* User Avatar */}
                    <Link href="/profile" className="hover:opacity-80 transition-opacity">
                        <div className="w-9 h-9 rounded-full bg-sand-beige border border-bone-white/30 flex items-center justify-center text-pine-dark shadow-sm">
                            <span className="font-bold text-[14px]">JS</span>
                        </div>
                    </Link>
                </div>
            </header>

            {/* Main Content: Two Column Layout */}
            <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                {/* Left Column: Persistent Artifact */}
                <aside className="w-full lg:w-[400px] xl:w-[450px] lg:sticky lg:top-[120px] bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col flex-shrink-0">
                    <h2 className="font-playfair font-bold text-[22px] md:text-[24px] text-pine-green mb-6 border-b border-gray-100 pb-4">
                        The Scenario
                    </h2>

                    <div className="space-y-6 text-pine-dark text-[17px] leading-relaxed">
                        <div 
                            className="bg-accent-green/5 p-4 rounded-lg border border-accent-green/10"
                            dangerouslySetInnerHTML={{ 
                                __html: activeScenario.artifact.replace(/\((\d+,\s*-?\d+(?:\.\d+)?)\)/g, '<strong>($1)</strong>') 
                            }} 
                        />

                        <div className="space-y-4 pt-2">
                            <div className="flex gap-3">
                                <span className="font-bold text-accent-gold whitespace-nowrap">Part A:</span>
                                <p className="text-[15px]">{comp.partA.label.replace(/^Part A:\s*/, "")}</p>
                            </div>

                            <div className="flex gap-3">
                                <span className="font-bold text-accent-gold whitespace-nowrap">Part B:</span>
                                <p className="text-[15px]">{comp.partB.label.replace(/^Part B:\s*/, "")}</p>
                            </div>

                            <div className="flex gap-3">
                                <span className="font-bold text-accent-gold whitespace-nowrap">Part C:</span>
                                <p className="text-[15px]">{comp.partC.label.replace(/^Part C:\s*/, "")}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Column: The Interactive Leg (Children) */}
                <section className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
                    {children}
                </section>

            </main>
        </div>
    );
}

export default function SlopeLessonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const conceptId = params.conceptId as string;

    // Map legacy "slope" path to "slope-1" scenario
    const actualScenarioId = conceptId === "slope" ? "slope-1" : conceptId;

    return (
        <TriadProvider initialScenarioId={actualScenarioId}>
            <SlopeLessonContent>
                {children}
            </SlopeLessonContent>
        </TriadProvider>
    );
}
