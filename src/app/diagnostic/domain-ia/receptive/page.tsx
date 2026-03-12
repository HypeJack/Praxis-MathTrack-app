"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useScorer } from "@/hooks/useScorer";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { ScorerFeedback } from "@/components/ScorerFeedback";
import { useRouter } from "next/navigation";

export default function ReceptiveLiteracyTask() {
    const [text, setText] = useState("");
    const [hasRetried, setHasRetried] = useState(false);
    const charLimit = 400;
    const router = useRouter();

    const { score, status, result, reset } = useScorer();
    const { setDomainScore, setCurrentStep } = useDiagnosticStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= charLimit) {
            setText(e.target.value);
        }
    };

    const isSubmittable = text.trim().length >= 20;

    const handleSubmit = async () => {
        const prompt = 'A student writes: "Since π is irrational and 1 is rational, π + 1 must be irrational..." Identify the claim, the vocabulary, and whether the reasoning is valid.';
        const scored = await score({
            taskType: 'receptive',
            domain: 'ia',
            prompt,
            response: text,
        });

        // Commit to store immediately
        setDomainScore('ia', {
            receptiveLiteracy: scored.score,
            receptiveRaw: text,
        });
    };

    const handleContinue = () => {
        setCurrentStep('ia', 'expressive');
        router.push("/diagnostic/domain-ia/expressive");
    };

    const handleRetry = () => {
        if (!hasRetried) {
            setHasRetried(true);
            setText("");
            reset();
        }
    };

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Step 1: Diagnostic Navigation Shell */}
            <header className="bg-pine-green w-full z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <Link href="/diagnostic/domain-ia/computation" className="text-bone-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </Link>
                    <span className="font-inter font-semibold text-[15px] text-bone-white">
                        Step 3 of 16
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[8px] bg-bone-white relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-500 ease-out"
                        style={{ width: "18%" }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
                {/* Step 2: Task Typography & Badging */}
                <div className="flex flex-col items-start space-y-4 mb-6">
                    <div className="bg-gold-tint px-3 py-1 rounded-full border border-accent-gold/20">
                        <span className="font-inter font-bold text-[13px] text-pine-green uppercase tracking-wider">
                            LITERACY &middot; READING MATH
                        </span>
                    </div>
                    <h1 className="font-playfair font-bold text-[26px] text-pine-green leading-tight">
                        What does this statement mean to you?
                    </h1>
                </div>

                {/* Step 3: Problem Card */}
                <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col shadow-sm mb-8">
                    <p className="font-inter text-[17px] text-pine-dark">
                        A student writes:
                    </p>

                    <blockquote className="my-6 border-l-4 border-pine-green/20 pl-4 py-2">
                        <p className="font-playfair italic text-[18px] text-pine-green leading-relaxed">
                            &quot;Since &pi; is irrational and 1 is rational, &pi; + 1 must be irrational...&quot;
                        </p>
                    </blockquote>

                    <p className="font-inter text-[17px] text-pine-dark">
                        Identify the claim, the vocabulary, and whether the reasoning is valid.
                    </p>
                </div>

                {/* Step 4: Textarea Input & State */}
                <div className="flex flex-col space-y-2">
                    {status === 'idle' || status === 'scoring' ? (
                        <textarea
                            rows={5}
                            value={text}
                            onChange={handleInputChange}
                            placeholder="Tap to type your interpretation..."
                            disabled={status === 'scoring'}
                            className="w-full p-4 rounded-[10px] bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark font-inter text-base transition-all outline-none resize-none disabled:opacity-50"
                        />
                    ) : null}

                    {status === 'scoring' && (
                        <p className="text-sm text-center text-gray-500 animate-pulse py-4">Analyzing your response...</p>
                    )}

                    {(status === 'complete' || status === 'error') && result && (
                        <ScorerFeedback
                            result={result}
                            onContinue={handleContinue}
                            onRetry={handleRetry}
                            canRetry={!hasRetried}
                        />
                    )}

                    <div className="flex justify-end mt-2">
                        <span className={`font-inter text-[13px] ${text.length >= charLimit ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                            {text.length} / {charLimit}
                        </span>
                    </div>
                </div>

                {/* Step 5: CTA & Navigation */}
                {(status === 'idle' || status === 'scoring') && (
                    <div className="mt-10">
                        <button
                            onClick={handleSubmit}
                            disabled={!isSubmittable || status === 'scoring'}
                            className={`w-full bg-accent-green rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-md transition-all duration-200 ${isSubmittable && status !== 'scoring'
                                    ? "opacity-100 active:scale-[0.98] hover:bg-[#5aa177]"
                                    : "opacity-50 cursor-not-allowed"
                                }`}
                        >
                            {status === 'scoring' ? 'Analyzing...' : 'Submit →'}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
