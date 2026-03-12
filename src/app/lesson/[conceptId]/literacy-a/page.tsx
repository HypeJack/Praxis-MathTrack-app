"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTriad } from "../TriadContext";
import triadData from "../../../../data/triadData.json";

export default function SlopeLiteracyA() {
    const params = useParams();
    const conceptId = params.conceptId as string;
    const router = useRouter();
    const { state, setLiteracyA_Status } = useTriad();
    
    const activeScenario = triadData.find(s => s.id === state.activeScenarioId) || triadData[0];

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [response, setResponse] = useState("");
    const [assessment, setAssessment] = useState("");

    const handleSubmit = () => {
        if (!response.trim()) return;
        setIsSubmitted(true);
    };

    const handleContinue = () => {
        // Map the assessment value to the strongly typed status
        setLiteracyA_Status(assessment as "Strong Match" | "Partial Match" | "Missed");
        router.push(`/lesson/${conceptId}/literacy-b`);
    }

    return (
        <div className="w-full h-full flex flex-col p-6 md:p-10 relative bg-white">
            <h1 className="font-inter font-bold uppercase tracking-wide text-[13px] text-gray-500 mb-6 border-b border-gray-100 pb-2">
                Literacy: Task Language
            </h1>

            <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                {/* Prompt */}
                <h2 className="font-playfair font-bold text-[22px] text-pine-green mb-6 leading-tight max-w-[600px]">
                    How would you re-narrate this problem for a student who is confused by the language? Write your explanation in your own words.
                </h2>

                {!isSubmitted ? (
                    <div className="flex-1 flex flex-col pt-2">
                        <div className="flex-1 min-h-[300px] mb-6">
                            <textarea
                                className="w-full h-full min-h-[300px] p-4 text-[16px] font-inter text-pine-dark bg-bone-white/30 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all placeholder:text-gray-400"
                                placeholder="E.g., Imagine you're walking along a path..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                            />
                        </div>

                        <div className="mt-auto pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={!response.trim()}
                                className={`w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-sm transition-all duration-200 gap-2 ${response.trim()
                                    ? "hover:bg-pine-dark/90 hover:shadow-md cursor-pointer active:scale-[0.99]"
                                    : "opacity-50 cursor-not-allowed"
                                    }`}
                            >
                                Compare My Answer
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-500 pt-2 pb-6">

                        {/* Model Answer Card */}
                        <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-4 relative shadow-sm">
                            <h3 className="font-inter font-bold text-[12px] uppercase tracking-wider text-pine-green mb-3">
                                Model Re-narration
                            </h3>
                            <p className="font-inter text-[16px] text-pine-dark leading-relaxed">
                                {activeScenario.literacyA?.modelAnswer}
                            </p>
                        </div>

                        {/* Your Submission Card */}
                        <div className="bg-white border border-gray-200 p-6 rounded-xl mb-8 relative shadow-sm">
                            <h3 className="font-inter font-bold text-[12px] uppercase tracking-wider text-pine-dark/60 mb-3">
                                Your Submission
                            </h3>
                            <p className="font-inter text-[15px] italic text-pine-dark/80">
                                "{response}"
                            </p>
                        </div>

                        {/* Self-Assessment Input */}
                        <div className="space-y-4 mb-4">
                            <label className="block font-playfair font-bold text-[20px] text-pine-green">
                                Honestly compare your answer to the model. How well did you capture the core concept?
                            </label>
                            <select
                                className="w-full p-3 text-[15px] font-inter text-pine-dark bg-bone-white/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all cursor-pointer appearance-none shadow-sm"
                                value={assessment}
                                onChange={(e) => setAssessment(e.target.value)}
                            >
                                <option value="" disabled className="text-gray-400">Select your assessment...</option>
                                <option value="Strong Match">Strong Match: I captured the rate of change clearly.</option>
                                <option value="Partial Match">Partial Match: I was close but missed some nuance.</option>
                                <option value="Missed">Missed: I need to refine how I explain this.</option>
                            </select>
                        </div>

                        {/* Final CTA */}
                        <div className="mt-auto pt-6 border-t border-gray-100">
                            <button
                                onClick={handleContinue}
                                disabled={!assessment}
                                className={`w-full rounded-[12px] py-4 px-6 flex items-center justify-center font-inter font-bold text-[18px] shadow-sm transition-all duration-200 gap-2 ${assessment
                                    ? "bg-pine-dark text-white hover:bg-pine-dark/90 hover:shadow-md cursor-pointer group active:scale-[0.99]"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                Continue to Student Work
                                <ArrowRight size={20} className={assessment ? "group-hover:translate-x-1 transition-transform" : "opacity-50"} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
