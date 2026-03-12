"use client";

import { X } from "lucide-react";
import Link from "next/link";

export default function DiagnosticDomainIntro() {
    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Step 1: Diagnostic Navigation Shell */}
            <header className="bg-pine-green w-full z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <Link href="/onboarding/setup" className="text-bone-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </Link>
                    <span className="font-inter font-semibold text-[15px] text-bone-white">
                        Step 1 of 16
                    </span>
                </div>

                {/* Progress Bar (directly below nav) */}
                <div className="w-full h-[8px] bg-bone-white relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-500 ease-out"
                        style={{ width: "6.25%" }} // 1/16 is 6.25%
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-6 pt-10 pb-32">
                {/* Step 2: Domain Header Typography */}
                <div className="flex flex-col items-start space-y-4 mb-10">
                    <div className="bg-accent-green/20 rounded-full px-4 py-1 flex items-center justify-center">
                        <span className="font-inter font-bold text-[15px] text-pine-green uppercase tracking-wider">
                            Domain I-A
                        </span>
                    </div>

                    <h1 className="font-playfair font-bold text-[34px] text-pine-green leading-tight">
                        Number & Quantity
                    </h1>

                    <p className="font-inter text-[16px] text-gray-500">
                        10% of the Praxis 5165 &middot; ~7 questions
                    </p>
                </div>

                {/* Step 3: Intro Card */}
                <div className="bg-green-tint rounded-[16px] border border-pine-green p-8 flex flex-col space-y-4 mb-auto">
                    <h2 className="font-playfair font-bold text-[24px] text-pine-green">
                        Let&apos;s see how you think about numbers.
                    </h2>
                    <p className="font-inter text-[17px] text-pine-dark/90 leading-relaxed">
                        You&apos;ll work through 3 short tasks. There are no trick questions &mdash; we&apos;re mapping where you are, not grading you.
                    </p>
                </div>

                {/* CTA (Positioned below card but stays in flow for mobile) */}
                <div className="mt-12">
                    <Link
                        href="/diagnostic/domain-ia/computation"
                        className="w-full bg-accent-green hover:bg-[#5aa177] active:scale-[0.98] transition-all duration-200 rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-md group"
                    >
                        Let&apos;s go &rarr;
                    </Link>
                </div>
            </div>
        </main>
    );
}
