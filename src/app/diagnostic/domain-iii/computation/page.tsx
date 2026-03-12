"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function GeometryComputation() {
    const [volume, setVolume] = useState("");
    const [distance, setDistance] = useState("");

    const appendSymbol = (setter: React.Dispatch<React.SetStateAction<string>>, symbol: string) => {
        setter(prev => prev + symbol);
    };

    const isSubmittable = volume.trim() !== "" && distance.trim() !== "";

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Step 1: Diagnostic Navigation Shell */}
            <header className="bg-pine-green w-full z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <Link href="/diagnostic/domain-iii/intro" className="text-bone-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </Link>
                    <span className="font-inter font-semibold text-[15px] text-bone-white">
                        Step 17 of 25
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[8px] bg-bone-white relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-500 ease-out"
                        style={{ width: "68%" }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
                {/* Step 2: Task Typography & Badging */}
                <div className="flex flex-col items-start space-y-4 mb-6">
                    <div className="bg-bone-white px-3 py-1 rounded-full border border-gray-200">
                        <span className="font-inter font-bold text-[13px] text-pine-green uppercase tracking-wider">
                            COMPUTATION &middot; DOMAIN III
                        </span>
                    </div>
                    <h1 className="font-playfair font-bold text-[26px] text-pine-green leading-tight">
                        Let&apos;s see how you work with this.
                    </h1>
                </div>

                {/* Step 3: Card 1 (Volume of a Solid) */}
                <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col shadow-sm mb-6">
                    <p className="font-inter text-[17px] text-pine-dark leading-relaxed mb-6">
                        A right circular cylinder has a height of 10 and a base radius of 3. What is its exact volume?
                    </p>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-stretch">
                            <input
                                type="text"
                                value={volume}
                                onChange={(e) => setVolume(e.target.value)}
                                placeholder="e.g., 90π"
                                className="flex-1 p-3 rounded-none rounded-l-md bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark outline-none transition-all"
                            />
                            <button
                                onClick={() => appendSymbol(setVolume, "π")}
                                className="bg-pine-green/10 px-4 rounded-none rounded-r-md border-y border-r border-transparent hover:bg-pine-green/20 transition-colors font-inter font-bold text-pine-green"
                            >
                                π
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 2: Coordinate Geometry */}
                <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col shadow-sm mb-8 space-y-4">
                    <p className="font-inter text-[17px] text-pine-dark leading-relaxed">
                        Find the exact distance between the points <span className="font-inter not-italic font-semibold tracking-wide mx-1">(-2, 4)</span> and <span className="font-inter not-italic font-semibold tracking-wide mx-1">(4, -4)</span>.
                    </p>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-stretch">
                            <input
                                type="text"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder="e.g., √25"
                                className="flex-1 p-3 rounded-none rounded-l-md bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark outline-none transition-all"
                            />
                            <button
                                onClick={() => appendSymbol(setDistance, "√")}
                                className="bg-pine-green/10 px-4 rounded-none rounded-r-md border-y border-r border-transparent hover:bg-pine-green/20 transition-colors font-inter font-bold text-pine-green"
                            >
                                √
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step 5: CTA & Navigation */}
                <div className="mt-auto pt-8">
                    <Link
                        href={isSubmittable ? "/diagnostic/domain-iii/receptive" : "#"}
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
