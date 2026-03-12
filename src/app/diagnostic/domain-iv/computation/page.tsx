"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function ComputationDomainIV() {
    const [prob, setProb] = useState("");
    const [dist, setDist] = useState("");

    const appendPercent = () => {
        if (!dist.includes("%")) {
            setDist(prev => prev + "%");
        }
    };

    const isSubmittable = prob.trim() !== "" && dist.trim() !== "";

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Step 1: Diagnostic Navigation Shell */}
            <header className="bg-pine-green w-full z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <Link href="/diagnostic/domain-iv/intro" className="text-bone-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </Link>
                    <span className="font-inter font-semibold text-[15px] text-bone-white">
                        Step 22 of 25
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[8px] bg-bone-white relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-500 ease-out"
                        style={{ width: "88%" }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
                {/* Step 2: Task Typography & Badging */}
                <div className="flex flex-col items-start space-y-4 mb-6">
                    <div className="bg-bone-white px-3 py-1 rounded-full border border-gray-200">
                        <span className="font-inter font-bold text-[13px] text-pine-green uppercase tracking-wider">
                            COMPUTATION &middot; DOMAIN IV
                        </span>
                    </div>
                    <h1 className="font-playfair font-bold text-[26px] text-pine-green leading-tight">
                        Let&apos;s see how you work with this.
                    </h1>
                </div>

                {/* Step 3: Card 1 (Probability) */}
                <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col shadow-sm mb-6">
                    <p className="font-inter text-[17px] text-pine-dark leading-relaxed mb-6">
                        A bag contains 4 red marbles, 5 blue marbles, and 3 green marbles. If two marbles are drawn without replacement, what is the exact probability that both are blue?
                    </p>
                    <div className="flex flex-col space-y-2">
                        <input
                            type="text"
                            value={prob}
                            onChange={(e) => setProb(e.target.value)}
                            placeholder="e.g., 5/33"
                            className="w-full p-4 rounded-[10px] bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark font-inter text-base transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Step 4: Card 2 (Normal Distribution) */}
                <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col shadow-sm mb-8 space-y-4">
                    <p className="font-inter text-[17px] text-pine-dark leading-relaxed">
                        A normally distributed data set has a mean of 70 and a standard deviation of 5. Approximately what percentage of the data falls between 65 and 75?
                    </p>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-stretch focus-within:ring-1 focus-within:ring-pine-green focus-within:border-pine-green rounded-md overflow-hidden">
                            <input
                                type="text"
                                value={dist}
                                onChange={(e) => setDist(e.target.value)}
                                placeholder="e.g., 68%"
                                className="flex-1 p-3 bg-bone-white border border-transparent text-pine-dark outline-none transition-all"
                            />
                            <button
                                onClick={appendPercent}
                                className="bg-pine-green/10 px-4 flex items-center justify-center border-l border-transparent hover:bg-pine-green/20 transition-colors font-inter font-bold text-pine-green"
                            >
                                %
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step 5: State & CTA */}
                <div className="mt-auto pt-8">
                    <Link
                        href={isSubmittable ? "/diagnostic/domain-iv/receptive" : "#"}
                        onClick={(e) => !isSubmittable && e.preventDefault()}
                        className={`w-full bg-accent-green rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-md transition-all duration-200 ${isSubmittable
                            ? "opacity-100 active:scale-[0.98] hover:bg-[#5aa177]"
                            : "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        Submit Answer
                    </Link>
                </div>
            </div>
        </main>
    );
}
