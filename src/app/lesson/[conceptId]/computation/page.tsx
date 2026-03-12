"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTriad } from "../TriadContext";
import triadData from "../../../../data/triadData.json";

export default function SlopeComputation() {
    const params = useParams();
    const conceptId = params.conceptId as string;
    const router = useRouter();
    const { state, setComputationStatus } = useTriad();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [answers, setAnswers] = useState({
        partA: "",
        partB: "",
        partC1: "",
        partC2: "",
    });

    const activeScenario = triadData.find(s => s.id === state.activeScenarioId) || triadData[0];
    const comp = activeScenario.computation;

    const isComplete =
        answers.partA.trim() &&
        answers.partB &&
        answers.partC1.trim() &&
        answers.partC2.trim();

    const handleSubmit = () => {
        if (!isComplete) return;

        const allCorrect =
            answers.partA === String(comp.partA.correctAnswer) &&
            answers.partB === comp.partB.correctAnswer &&
            answers.partC1 === String(comp.partC.input1Correct) &&
            answers.partC2 === String(comp.partC.input2Correct);

        setComputationStatus(allCorrect ? "Supported" : "Needs Improvement");
        setIsSubmitted(true);
    };

    React.useEffect(() => {
        if (isSubmitted && state.computationStatus === "Supported") {
            const completed = JSON.parse(localStorage.getItem("mti_completed_lessons") || "[]");
            if (!completed.includes(conceptId)) {
                completed.push(conceptId);
                localStorage.setItem("mti_completed_lessons", JSON.stringify(completed));
            }
        }
    }, [isSubmitted, state.computationStatus, conceptId]);

    return (
        <div className="w-full h-full flex flex-col p-6 md:p-10 relative bg-white">
            <h1 className="font-inter font-bold uppercase tracking-wide text-[13px] text-gray-500 mb-6 border-b border-gray-100 pb-2">
                Computation
            </h1>

            {!isSubmitted ? (
                /* Pre-Submit: Computation Workspace */
                <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                    <div className="flex-1 space-y-8 mb-6">
                        {/* Part A: Number Input */}
                        <div className="space-y-3">
                            <label className="block font-inter font-semibold text-[16px] text-pine-dark">
                                {comp.partA.label}
                            </label>
                            <input
                                type="number"
                                className="w-[120px] p-3 text-[16px] font-inter text-pine-dark bg-bone-white/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all placeholder:text-gray-400"
                                placeholder="Answer"
                                value={answers.partA}
                                onChange={(e) => setAnswers({ ...answers, partA: e.target.value })}
                            />
                        </div>

                        {/* Part B: Dropdown Select */}
                        <div className="space-y-3">
                            <label className="block font-inter font-semibold text-[16px] text-pine-dark">
                                {comp.partB.label}
                            </label>
                            <select
                                className="w-full max-w-[400px] p-3 text-[16px] font-inter text-pine-dark bg-bone-white/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all cursor-pointer appearance-none"
                                value={answers.partB}
                                onChange={(e) => setAnswers({ ...answers, partB: e.target.value })}
                            >
                                {comp.partB.options.map((opt, i) => (
                                    <option key={i} value={i === 0 ? "" : opt} disabled={i === 0} className={i === 0 ? "text-gray-400" : ""}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Part C: Two Side-by-Side Number Inputs */}
                        <div className="space-y-3">
                            <label className="block font-inter font-semibold text-[16px] text-pine-dark">
                                {comp.partC.label}
                            </label>
                            <div className="flex items-center gap-6 flex-wrap">
                                <div className="flex flex-col gap-1.5">
                                    <span className="font-inter text-[13px] font-medium text-gray-500 uppercase tracking-wide">
                                        {comp.partC.input1Label}
                                    </span>
                                    <input
                                        type="number"
                                        className="w-[100px] p-3 text-center text-[16px] font-inter text-pine-dark bg-bone-white/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all"
                                        value={answers.partC1}
                                        onChange={(e) => setAnswers({ ...answers, partC1: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="font-inter text-[13px] font-medium text-gray-500 uppercase tracking-wide">
                                        {comp.partC.input2Label}
                                    </span>
                                    <input
                                        type="number"
                                        className="w-[100px] p-3 text-center text-[16px] font-inter text-pine-dark bg-bone-white/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all"
                                        value={answers.partC2}
                                        onChange={(e) => setAnswers({ ...answers, partC2: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <button
                            onClick={handleSubmit}
                            disabled={!isComplete}
                            className={`w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-sm transition-all duration-200 gap-2 ${isComplete
                                ? "hover:bg-pine-dark/90 hover:shadow-md cursor-pointer active:scale-[0.99]"
                                : "opacity-50 cursor-not-allowed"
                                }`}
                        >
                            Submit Responses
                        </button>
                    </div>
                </div>
            ) : (
                /* Post-Submit: Arc Zoom-Out State */
                <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 fade-in duration-500">

                    <div className="flex items-center gap-2 mb-8 text-accent-green">
                        <CheckCircle2 size={24} className="fill-accent-green/20" />
                        <span className="font-inter font-medium text-[16px]">Response recorded. Now, let&apos;s zoom out.</span>
                    </div>

                    {/* Arc Zoom-Out UI */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-6 relative mb-8 z-10">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gray-200 -z-10" />

                        {/* Connecting Line (Mobile) */}
                        <div className="lg:hidden absolute left-[28px] top-[10%] bottom-[10%] w-[2px] bg-gray-200 -z-10" />

                        {/* Node 1: Before */}
                        <div className="flex-1 flex flex-row lg:flex-col items-start lg:items-center gap-4 group">
                            <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-400 font-bold font-inter text-[14px] bg-blend-multiply group-hover:border-gray-300 transition-colors shadow-sm">
                                01
                            </div>
                            <div className="bg-bone-white border border-gray-100 p-5 rounded-xl shadow-sm lg:text-center text-left flex-1 relative top-[-4px] lg:top-0">
                                <h3 className="font-playfair font-bold text-[18px] text-pine-dark mb-2">
                                    {activeScenario.arcZoomOut?.before?.split('.')[0]}
                                </h3>
                                <p className="font-inter text-[14px] text-pine-dark/80 leading-relaxed">
                                    {activeScenario.arcZoomOut?.before?.split('.').slice(1).join('.').trim()}
                                </p>
                            </div>
                        </div>

                        {/* Node 2: Current */}
                        <div className="flex-1 flex flex-row lg:flex-col items-start lg:items-center gap-4 relative">
                            {/* Highlight Pulse */}
                            <div className="absolute top-[8px] lg:top-[8px] left-[8px] lg:left-1/2 lg:-translate-x-1/2 w-10 h-10 rounded-full bg-accent-green/20 animate-ping -z-10" />

                            <div className="w-14 h-14 rounded-full bg-white border-[3px] border-accent-green flex items-center justify-center flex-shrink-0 text-accent-green font-bold font-inter text-[14px] shadow-sm relative lg:-top-[2px]">
                                02
                            </div>
                            <div className="bg-accent-green/5 border border-accent-green/30 p-5 rounded-xl shadow-sm lg:text-center text-left flex-1 relative top-[-4px] lg:top-0">
                                <h3 className="font-playfair font-bold text-[18px] text-pine-green mb-2">
                                    {activeScenario.conceptTopic} (THIS CONCEPT)
                                </h3>
                                <p className="font-inter text-[14px] text-pine-dark/90 leading-relaxed">
                                    {activeScenario.arcZoomOut?.concept}
                                </p>
                            </div>
                        </div>

                        {/* Node 3: After */}
                        <div className="flex-1 flex flex-row lg:flex-col items-start lg:items-center gap-4 group">
                            <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-400 font-bold font-inter text-[14px] shadow-sm group-hover:border-gray-300 transition-colors">
                                03
                            </div>
                            <div className="bg-bone-white border border-gray-100 p-5 rounded-xl shadow-sm lg:text-center text-left flex-1 relative top-[-4px] lg:top-0">
                                <h3 className="font-playfair font-bold text-[18px] text-pine-dark mb-2">
                                    {activeScenario.arcZoomOut?.after?.split('.')[0]}
                                </h3>
                                <p className="font-inter text-[14px] text-pine-dark/80 leading-relaxed">
                                    {activeScenario.arcZoomOut?.after?.split('.').slice(1).join('.').trim()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <button
                            onClick={() => router.push(`/lesson/${conceptId}/literacy-a`)}
                            className="w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-sm transition-all duration-200 gap-2 hover:bg-pine-dark/90 hover:shadow-md cursor-pointer group active:scale-[0.99]"
                        >
                            Continue to Literacy
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
