"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { useTriad } from "../TriadContext";
import triadData from "../../../../data/triadData.json";

export default function SlopeSummary() {
    const router = useRouter();
    const [confidence, setConfidence] = useState<number | null>(null);
    const { state, setActiveScenarioId } = useTriad();
    
    const activeScenario = triadData.find(s => s.id === state.activeScenarioId) || triadData[0];

    // Safety fallback strings in case a user jumped straight to the summary page directly during dev
    const compStatusText = state.computationStatus || "Supported";
    const litAStatusText = state.literacyA_Status || "Strong Match";
    const litBStatusText = state.literacyB_Status || "Precise Gap Identified";

    // Dynamic warning logic for colors
    const compNeedsWarning = compStatusText === "Needs Improvement";
    const litANeedsWarning = litAStatusText === "Missed" || litAStatusText === "Partial Match";
    const litBNeedsWarning = litBStatusText === "Needs Improvement";

    // Dynamic final CTA logic:
    // If ANY of the three cards reflect a "Needs Improvement", "Missed", or "Supported" state, the button should "Try Another Scenario".
    // Wait, the prompt said: "If ANY of the three cards reflect a 'Needs Improvement', 'Missed', or 'Supported' state, the button should say 'Try Another Scenario'".
    // Let's assume 'Supported' isn't actually a failure, but following literal prompt logic:
    const needsImprovement =
        compNeedsWarning ||
        litANeedsWarning ||
        litBNeedsWarning ||
        compStatusText === "Supported"; // Based directly on prompt task constraints for routing.

    return (
        <div className="w-full h-full flex flex-col p-6 md:p-10 relative bg-white overflow-y-auto">

            <div className="flex-1 flex flex-col max-w-[800px] mx-auto w-full animate-in fade-in duration-500">

                {/* Headline */}
                <h1 className="font-playfair font-bold text-[28px] text-pine-green mb-10 text-center leading-tight">
                    Concept Journey Complete
                </h1>

                {/* The Confidence Delta */}
                <div className="mb-12 flex flex-col items-center">
                    <p className="font-inter text-[16px] text-gray-700 italic mb-6 text-center">
                        How do you feel about this concept now?
                    </p>

                    <div className="flex justify-between w-full max-w-[360px]">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                onClick={() => setConfidence(num)}
                                className={`w-14 h-14 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-lg font-semibold cursor-pointer transition-all ${confidence === num
                                    ? "bg-accent-green border-accent-green text-white ring-2 ring-accent-green ring-offset-2"
                                    : "bg-white border-gray-300 text-pine-dark hover:border-accent-green/50"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Performance Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {/* Column 1: Computation */}
                    <div className="bg-bone-white border border-gray-200 p-5 rounded-[12px] flex flex-col items-center text-center shadow-sm">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${compNeedsWarning ? 'bg-orange-100' : 'bg-accent-green/10'}`}>
                            {compNeedsWarning ? (
                                <AlertCircle className="text-orange-600 w-5 h-5" />
                            ) : (
                                <CheckCircle2 className="text-accent-green w-5 h-5" />
                            )}
                        </div>
                        <h3 className="font-inter font-bold text-[14px] uppercase tracking-wider text-pine-dark mb-1">
                            Computation
                        </h3>
                        <p className={`font-inter font-medium text-[15px] ${compNeedsWarning ? 'text-orange-600' : 'text-accent-green'}`}>
                            Status: {compStatusText}
                        </p>
                    </div>

                    {/* Column 2: Task Language */}
                    <div className="bg-bone-white border border-gray-200 p-5 rounded-[12px] flex flex-col items-center text-center shadow-sm">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${litANeedsWarning ? 'bg-orange-100' : 'bg-accent-gold/10'}`}>
                            {litANeedsWarning ? (
                                <AlertCircle className="text-orange-600 w-5 h-5" />
                            ) : (
                                <MessageSquare className="text-accent-gold w-5 h-5" />
                            )}
                        </div>
                        <h3 className="font-inter font-bold text-[14px] uppercase tracking-wider text-pine-dark mb-1">
                            Task Language
                        </h3>
                        <p className={`font-inter font-medium text-[15px] ${litANeedsWarning ? 'text-orange-600' : 'text-accent-gold'}`}>
                            Status: {litAStatusText}
                        </p>
                    </div>

                    {/* Column 3: Interpretation */}
                    <div className="bg-bone-white border border-gray-200 p-5 rounded-[12px] flex flex-col items-center text-center shadow-sm">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${litBNeedsWarning ? 'bg-orange-100' : 'bg-highlight-terracotta/10'}`}>
                            <AlertCircle className={`w-5 h-5 ${litBNeedsWarning ? 'text-orange-600' : 'text-highlight-terracotta'}`} />
                        </div>
                        <h3 className="font-inter font-bold text-[14px] uppercase tracking-wider text-pine-dark mb-1">
                            Interpretation
                        </h3>
                        <p className={`font-inter font-medium text-[15px] ${litBNeedsWarning ? 'text-orange-600' : 'text-highlight-terracotta'}`}>
                            Status: {litBStatusText}
                        </p>
                    </div>
                </div>

                {/* AI Closing Narrative */}
                <div className="mb-12 border-l-4 border-pine-green pl-6 py-2">
                    <h3 className="font-inter font-bold text-[15px] uppercase tracking-wider text-pine-green mb-3">
                        Coach&apos;s Note
                    </h3>
                    <p className="font-inter text-[16px] text-pine-dark leading-relaxed">
                        {activeScenario.closingNarrative || ""}
                    </p>
                </div>

                {/* Final CTA Button */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-sm transition-all duration-200 gap-2 hover:bg-pine-dark/90 hover:shadow-md cursor-pointer group active:scale-[0.99]"
                    >
                        {needsImprovement ? "Let's take a break from this concept and come back later" : "Continue your journey with more concepts"}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
}
