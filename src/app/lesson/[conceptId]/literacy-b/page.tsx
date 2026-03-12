"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTriad } from "../TriadContext";
import triadData from "../../../../data/triadData.json";

export default function SlopeLiteracyB() {
    const params = useParams();
    const conceptId = params.conceptId as string;
    const router = useRouter();
    const { state, setLiteracyB_Status } = useTriad();
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Using strongly typed initial state to match the prompt options
    const [responses, setResponses] = useState({
        understand: "",
        misconception: "",
        respond: ""
    });

    const activeScenario = triadData.find(s => s.id === state.activeScenarioId) || triadData[0];
    const data = activeScenario.literacyB;

    const isComplete = responses.understand && responses.misconception && responses.respond;

    // Derived State
    const isExcellent =
        responses.understand === data.dropdown1.correct &&
        responses.misconception === data.dropdown2.correct &&
        responses.respond === data.dropdown3.correct;

    const handleSubmit = () => {
        if (!isComplete) return;
        setLiteracyB_Status(isExcellent ? "Precise Gap Identified" : "Needs Improvement");
        setIsSubmitted(true);
    };

    return (
        <div className="w-full h-full flex flex-col p-6 md:p-10 relative bg-white overflow-y-auto">
            <h1 className="font-inter font-bold uppercase tracking-wide text-[13px] text-gray-500 mb-6 border-b border-gray-100 pb-2 flex-shrink-0">
                Literacy: Misconception Interpretation
            </h1>

            <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                {/* Student Work Sample Card */}
                <div className="bg-bone-white border-l-4 border-highlight-terracotta p-6 rounded-r-xl rounded-l-sm mb-8 shadow-sm">
                    <h3 className="font-inter font-semibold text-[14px] uppercase tracking-wider text-highlight-terracotta mb-4 flex items-center gap-2">
                        Student Work Sample
                    </h3>

                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="font-inter font-medium text-[16px] text-pine-dark">
                                "{data.studentWork}"
                            </p>
                        </div>

                        <div>
                            <p className="font-inter text-[14px] text-pine-dark/70 mb-1 font-medium pb-1 border-b border-gray-200 inline-block">
                                Student's explanation:
                            </p>
                            <p className="font-inter text-[15px] italic text-pine-dark/80 mt-2">
                                "{data.studentExplanation}"
                            </p>
                        </div>
                    </div>
                </div>

                {!isSubmitted ? (
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Three-Part Prompt */}
                        <div className="space-y-6 flex-1">
                            {/* Dropdown 1: Understanding */}
                            <div className="space-y-2">
                                <label className="block font-inter font-semibold text-[15px] text-pine-dark">
                                    What does this student understand?
                                </label>
                                <select
                                    className="w-full p-3 text-[15px] font-inter text-pine-dark bg-bone-white/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all cursor-pointer appearance-none"
                                    value={responses.understand}
                                    onChange={(e) => setResponses({ ...responses, understand: e.target.value })}
                                >
                                    {data.dropdown1?.options?.map((opt: string, i: number) => (
                                        <option key={i} value={i === 0 ? "" : opt} disabled={i === 0} className={i === 0 ? "text-gray-400" : ""}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Dropdown 2: Misconception */}
                            <div className="space-y-2">
                                <label className="block font-inter font-semibold text-[15px] text-pine-dark">
                                    What is their misconception?
                                </label>
                                <select
                                    className="w-full p-3 text-[15px] font-inter text-pine-dark bg-bone-white/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all cursor-pointer appearance-none"
                                    value={responses.misconception}
                                    onChange={(e) => setResponses({ ...responses, misconception: e.target.value })}
                                >
                                    {data.dropdown2?.options?.map((opt: string, i: number) => (
                                        <option key={i} value={i === 0 ? "" : opt} disabled={i === 0} className={i === 0 ? "text-gray-400" : ""}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Dropdown 3: Response */}
                            <div className="space-y-2">
                                <label className="block font-inter font-semibold text-[15px] text-pine-dark">
                                    How would you respond?
                                </label>
                                <select
                                    className="w-full p-3 text-[15px] font-inter text-pine-dark bg-bone-white/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all cursor-pointer appearance-none"
                                    value={responses.respond}
                                    onChange={(e) => setResponses({ ...responses, respond: e.target.value })}
                                >
                                    {data.dropdown3?.options?.map((opt: string, i: number) => (
                                        <option key={i} value={i === 0 ? "" : opt} disabled={i === 0} className={i === 0 ? "text-gray-400" : ""}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={!isComplete}
                                className={`w-full py-4 rounded-xl font-bold text-white bg-pine-green hover:bg-opacity-90 transition-all mt-8 text-lg ${isComplete
                                    ? "hover:bg-opacity-90 cursor-pointer active:scale-[0.99]"
                                    : "opacity-50 cursor-not-allowed"
                                    }`}
                            >
                                Submit Response
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-500 pt-2">
                        {/* Dynamic Mock AI Evaluation Card */}
                        <div className={`p-6 leading-relaxed flex flex-col gap-2 rounded-xl mb-8 relative border ${isExcellent
                            ? 'bg-green-50 border-green-500 text-green-800'
                            : 'bg-orange-50 border-orange-500 text-orange-800'
                            }`}
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <Sparkles className={`w-5 h-5 opacity-50 ${isExcellent ? 'text-green-500' : 'text-orange-500'}`} />
                            </div>

                            <h3 className={`font-inter font-bold text-[14px] uppercase tracking-wider mb-3 ${isExcellent ? 'text-green-700' : 'text-orange-700'}`}>
                                {isExcellent ? "Excellent Diagnosis" : "Needs Improvement"}
                            </h3>
                            <p className="font-inter text-[16px] leading-relaxed">
                                {isExcellent
                                    ? data.feedbackExcellent
                                    : data.feedbackImprovement
                                }
                            </p>
                        </div>

                        <div className="mt-auto pt-4 flex-shrink-0">
                            <button
                                onClick={() => router.push(`/lesson/${conceptId}/summary`)}
                                className="w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-sm transition-all duration-200 gap-2 hover:bg-pine-dark/90 hover:shadow-md cursor-pointer group active:scale-[0.99]"
                            >
                                Complete Concept Journey
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
