"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DiagnosticComplete() {
    const [showItems, setShowItems] = useState([false, false, false, false, false]);

    useEffect(() => {
        // Staggered animation for checklist items
        const timeouts = [
            setTimeout(() => setShowItems(prev => [true, prev[1], prev[2], prev[3], prev[4]]), 400),
            setTimeout(() => setShowItems(prev => [prev[0], true, prev[2], prev[3], prev[4]]), 600),
            setTimeout(() => setShowItems(prev => [prev[0], prev[1], true, prev[3], prev[4]]), 800),
            setTimeout(() => setShowItems(prev => [prev[0], prev[1], prev[2], true, prev[4]]), 1000),
            setTimeout(() => setShowItems(prev => [prev[0], prev[1], prev[2], prev[3], true]), 1200)
        ];
        return () => timeouts.forEach(t => clearTimeout(t));
    }, []);

    const checklistItems = [
        "Number & Quantity",
        "Algebra",
        "Functions & Calculus",
        "Geometry",
        "Statistics & Probability"
    ];

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-pine-green font-inter relative shadow-xl overflow-x-hidden p-8 justify-center items-center">

            {/* Step 2: Typography & Celebratory Elements */}
            <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
                <span className="font-inter font-bold text-[22px] text-accent-green tracking-wide">
                    Diagnostic Complete!
                </span>
                <h1 className="font-playfair font-bold text-[40px] text-bone-white mt-2 leading-tight">
                    You did it.
                </h1>
            </div>

            {/* Step 3: Animated Checklist */}
            <div className="flex flex-col items-start space-y-4 mb-16 w-full max-w-[320px]">
                {checklistItems.map((item, index) => (
                    <div
                        key={item}
                        className={`flex items-center space-x-3 transition-all duration-500 ease-out ${showItems[index]
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4"
                            }`}
                    >
                        <div className="bg-accent-green rounded-full p-1 shadow-glow-green shrink-0">
                            <Check className="text-pine-green font-bold" size={18} strokeWidth={4} />
                        </div>
                        <span className="font-inter text-[18px] text-accent-green font-medium tracking-wide">
                            {item}
                        </span>
                    </div>
                ))}
            </div>

            {/* Step 4: Remaining Count & CTA */}
            <div className="w-full max-w-[320px] space-y-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000 mt-8">
                <p className="font-playfair italic text-[20px] text-accent-green text-center leading-relaxed mb-4">
                    We&apos;ve mapped your strengths. Let&apos;s build your custom learning plan.
                </p>

                <Link
                    href="/reveal"
                    className="w-full bg-accent-green rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-lg hover:brightness-105 active:scale-95 transition-all duration-200"
                >
                    View My Results &rarr;
                </Link>
            </div>

            {/* Decorative Background Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[60%] bg-accent-green/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        </main>
    );
}
