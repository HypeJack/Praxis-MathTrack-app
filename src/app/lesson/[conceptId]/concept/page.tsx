"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTriad } from "../TriadContext";
import triadData from "../../../../data/triadData.json";

export default function SlopeConceptNarrative() {
    const params = useParams();
    const conceptId = params.conceptId as string;
    const router = useRouter();
    const { state } = useTriad();

    const activeScenario = triadData.find(s => s.id === state.activeScenarioId) || triadData[0];

    if (!activeScenario) return null; // Safety for empty data

    return (
        <div className="w-full h-full flex flex-col p-6 md:p-10 relative bg-white">

            <div className="flex-1 max-w-[600px] mx-auto w-full flex flex-col pt-4 md:pt-8">
                {/* Headline */}
                <h1 className="font-playfair font-bold text-[24px] text-pine-green mb-8 leading-tight">
                    Before you solve, let's look at the story of this concept.
                </h1>

                {/* AI Narration Body */}
                <div className="space-y-6 font-inter text-[16px] text-pine-dark leading-relaxed">
                    {activeScenario.conceptNarrative.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}

                    <p className="font-medium mt-8 text-accent-gold">
                        Now look at the problem on the left. Before you calculate anything, ask: what is this concept&apos;s story?
                    </p>
                </div>

                {/* CTA Button */}
                <div className="mt-12 w-full pt-6">
                    <button
                        onClick={() => router.push(`/lesson/${conceptId}/computation`)}
                        className="w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-sm transition-all duration-200 gap-2 hover:bg-pine-dark/90 hover:shadow-md cursor-pointer group"
                    >
                        I'm ready to solve
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

        </div>
    );
}
