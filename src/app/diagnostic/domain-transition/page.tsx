"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DomainTransition() {
    const [showItems, setShowItems] = useState([false, false, false]);

    useEffect(() => {
        // Staggered animation for checklist items
        const timeouts = [
            setTimeout(() => setShowItems(prev => [true, prev[1], prev[2]]), 400),
            setTimeout(() => setShowItems(prev => [prev[0], true, prev[2]]), 800),
            setTimeout(() => setShowItems(prev => [prev[0], prev[1], true]), 1200)
        ];
        return () => timeouts.forEach(t => clearTimeout(t));
    }, []);

    const checklistItems = [
        "Computation task",
        "Literacy tasks",
        "Confidence rating"
    ];

    return (
        <main className="w-full min-h-[calc(100dvh-64px)] bg-pine-green flex flex-col items-center justify-center px-6 py-12 font-inter text-center">
            {/* Step 2: Typography & Celebratory Elements */}
            <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="text-accent-green font-bold tracking-wide uppercase text-sm mb-2">
                    DOMAIN I-A COMPLETE!
                </span>
                <h1 className="text-bone-white font-playfair font-bold text-3xl mb-6 leading-tight">
                    Number & Quantity
                </h1>
            </div>

            {/* Step 3: Animated Checklist */}
            <div className="inline-block text-left mb-8">
                <div className="flex flex-col items-start space-y-6 px-4">
                    {checklistItems.map((item, index) => (
                        <div
                            key={item}
                            className={`flex items-center space-x-4 transition-all duration-500 ease-out ${showItems[index]
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4"
                                }`}
                        >
                            <div className="w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green">
                                <Check size={16} strokeWidth={3} />
                            </div>
                            <span className="font-inter text-[18px] text-accent-green">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 4: Remaining Count & CTA */}
            <div className="w-full max-w-md flex flex-col items-center">
                <p className="text-bone-white font-inter italic mb-6 animate-in fade-in duration-1000 delay-[1000ms] fill-mode-both">
                    4 more domains to go.
                </p>
                <Link
                    href="/diagnostic/domain-ib/intro"
                    className="w-full bg-accent-green rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-lg transition-all duration-200 active:scale-[0.98] hover:bg-[#5aa177] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-[1200ms] fill-mode-both"
                >
                    On to Algebra &rarr;
                </Link>
            </div>
        </main>
    );
}
