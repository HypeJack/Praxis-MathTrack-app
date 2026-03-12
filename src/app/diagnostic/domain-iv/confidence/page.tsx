"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { useRouter } from "next/navigation";

export default function ConfidenceDomainIV() {
    const [rating, setRating] = useState<number | null>(null);
    const router = useRouter();
    const { setDomainScore, completeDiagnostic } = useDiagnosticStore();

    const ratings = [1, 2, 3, 4, 5];
    const labels: { [key: number]: string } = {
        1: "Just starting here",
        2: "I know some of this",
        3: "Somewhat confident",
        4: "Pretty solid",
        5: "I've got this."
    };

    const handleFinish = () => {
        if (!rating) return;
        setDomainScore('iv', { confidence: rating });
        completeDiagnostic();
        router.push("/reveal");
    };

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Step 1: Diagnostic Navigation Shell */}
            <header className="bg-pine-green w-full z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <Link href="/diagnostic/domain-iv/expressive" className="text-bone-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </Link>
                    <span className="font-inter font-semibold text-[15px] text-bone-white">
                        Step 25 of 25
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[8px] bg-bone-white relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-500 ease-out"
                        style={{ width: "100%" }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-6 pt-12 pb-32">
                {/* Step 2: Typography */}
                <div className="space-y-4 mb-12">
                    <h1 className="font-playfair font-bold text-[30px] text-pine-green leading-tight">
                        One last thing for this section &mdash; How did that feel?
                    </h1>
                    <p className="font-inter text-[17px] text-pine-dark">
                        Rate your confidence in Statistics &amp; Probability from 1 to 5.
                    </p>
                </div>

                {/* Step 3: Rating UI & State */}
                <div className="flex flex-col items-center mb-10">
                    <div className="flex justify-between w-full max-w-[320px] mb-2">
                        {ratings.map((val) => (
                            <button
                                key={val}
                                onClick={() => setRating(val)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-inter font-bold text-[22px] transition-all duration-200 active:scale-95 shadow-sm
                  ${rating === val
                                        ? "bg-accent-gold text-white ring-2 ring-accent-gold ring-offset-2 ring-offset-bone-white"
                                        : "bg-white border border-gray-300 text-pine-dark hover:border-accent-gold/50"
                                    }`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>

                    {/* Anchor Labels */}
                    <div className="flex justify-between w-full max-w-[320px] px-1">
                        <span className="font-inter text-[14px] text-gray-500">Not sure</span>
                        <span className="font-inter text-[14px] text-gray-500">Fully confident</span>
                    </div>
                </div>

                {/* Dynamic Selection Feedback Card */}
                <div className="min-h-[80px] flex items-center justify-center">
                    {rating && (
                        <div className="w-full bg-accent-gold/10 border border-accent-gold/30 rounded-[12px] p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <p className="text-center font-inter font-semibold text-[15px] text-accent-gold">
                                Selected: {rating} &mdash; {labels[rating]}
                            </p>
                        </div>
                    )}
                </div>

                {/* Step 4: CTA & Navigation */}
                <div className="mt-auto pt-8">
                    <button
                        onClick={handleFinish}
                        disabled={!rating}
                        className={`w-full py-4 px-6 rounded-[12px] flex items-center justify-center font-inter font-bold text-[18px] transition-all duration-300 shadow-md ${rating
                            ? "bg-pine-dark text-white hover:bg-pine-green active:scale-95 opacity-100"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                            }`}
                    >
                        Finish Diagnostic →
                    </button>
                </div>
            </div>
        </main>
    );
}
