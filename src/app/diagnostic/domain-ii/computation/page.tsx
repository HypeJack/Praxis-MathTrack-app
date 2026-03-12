"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function DomainIIComputation() {
    const [compositionInput, setCompositionInput] = useState("");
    const [derivativeInput, setDerivativeInput] = useState("");

    const handleQuickInsert = () => {
        setDerivativeInput(prev => prev + "²");
    };

    const isSubmittable = compositionInput.trim() !== "" && derivativeInput.trim() !== "";

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Step 1: Diagnostic Navigation Shell */}
            <header className="bg-pine-green w-full z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <Link href="/diagnostic/domain-ii/intro" className="text-bone-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </Link>
                    <span className="font-inter font-semibold text-[15px] text-bone-white">
                        Step 12 of 16
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[8px] bg-bone-white relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-500 ease-out"
                        style={{ width: "75%" }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
                {/* Step 2: Task Typography & Badging */}
                <div className="flex flex-col items-start space-y-4 mb-6">
                    <div className="bg-bone-white px-3 py-1 rounded-full border border-gray-200">
                        <span className="font-inter font-bold text-[13px] text-pine-green uppercase tracking-wider">
                            COMPUTATION &middot; DOMAIN II
                        </span>
                    </div>
                    <h1 className="font-playfair font-bold text-[26px] text-pine-green leading-tight">
                        Let&apos;s see how you work with this.
                    </h1>
                </div>

                <div className="flex flex-col space-y-6">
                    {/* Step 3: Card 1 (Function Composition) */}
                    <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col shadow-sm">
                        <p className="font-inter text-[15px] text-gray-600 mb-4">
                            Given <span className="font-inter not-italic font-semibold mx-1 text-pine-dark">f(x) = 2x + 1</span> and <span className="font-inter not-italic font-semibold mx-1 text-pine-dark">g(x) = x<sup>2</sup> &minus; 3</span>, find:
                        </p>
                        <div className="font-inter font-bold text-[22px] text-pine-green mb-6">
                            f(g(2))
                        </div>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="text"
                                value={compositionInput}
                                onChange={(e) => setCompositionInput(e.target.value)}
                                placeholder="Enter value..."
                                className="w-full p-4 rounded-[12px] bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark font-inter text-base transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Step 4: Card 2 (Calculus Derivative) */}
                    <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col shadow-sm">
                        <p className="font-inter text-[15px] text-gray-600 mb-4">
                            Find the derivative with respect to x:
                        </p>
                        <div className="font-inter font-bold text-[22px] text-pine-green mb-6">
                            f(x) = 4x&sup3; &minus; 2x
                        </div>
                        <div className="flex w-full">
                            <input
                                type="text"
                                value={derivativeInput}
                                onChange={(e) => setDerivativeInput(e.target.value)}
                                placeholder="f'(x) = ..."
                                className="flex-1 p-4 rounded-l-[12px] bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark font-inter text-base transition-all outline-none"
                            />
                            <button
                                onClick={handleQuickInsert}
                                className="px-4 bg-pine-green/10 text-pine-green border-l border-white/20 hover:bg-pine-green/20 transition-colors flex items-center justify-center font-inter font-bold text-[18px] rounded-r-[12px]"
                            >
                                &sup2;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step 5: CTA */}
                <div className="mt-auto pt-8">
                    <Link
                        href={isSubmittable ? "/diagnostic/domain-ii/receptive" : "#"}
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
