import Link from "next/link";

export default function OnboardingScreen02() {
    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Top area - Progress + Content */}
            <div className="flex-1 flex flex-col px-6 pt-8 pb-48 relative z-10">
                {/* Progress Bar */}
                <div className="mb-8">
                    <p className="text-[13px] font-semibold text-pine-dark/60 mb-2 uppercase tracking-wide">
                        Step 1 of 3
                    </p>
                    <div className="w-full h-[6px] bg-pine-green/10 rounded-full overflow-hidden">
                        <div className="h-full bg-pine-green rounded-full w-1/3 transition-all duration-500 ease-out" />
                    </div>
                </div>

                {/* Headline */}
                <h1 className="font-playfair font-bold text-[28px] text-pine-dark leading-snug animate-[slide-up-fade_600ms_ease-out_forwards]">
                    Math for the Praxis 5165
                </h1>

                {/* The Triad SVG Component */}
                <div className="relative w-[240px] h-[240px] mx-auto mt-12 mb-12">
                    {/* SVG Triangle */}
                    <svg width="240" height="240" viewBox="0 0 240 240" className="absolute inset-0 overflow-visible z-0">
                        <path
                            d="M120 20 L220 193 L20 193 Z"
                            stroke="#0E5546"
                            strokeWidth="3"
                            fill="none"
                            strokeLinejoin="round"
                            strokeDasharray="700"
                            strokeDashoffset="700"
                            className="animate-[draw-triangle_800ms_ease-out_forwards] [animation-delay:200ms]"
                        />
                    </svg>

                    {/* Glow Dots (Appear after triangle draws) */}
                    <div className="absolute top-[20px] left-[120px] -translate-x-1/2 -translate-y-1/2 opacity-0 animate-[fade-in_400ms_ease-out_forwards] [animation-delay:1000ms]">
                        <div className="w-8 h-8 rounded-full bg-accent-gold/30 animate-glow-pulse flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-accent-gold" />
                        </div>
                    </div>

                    <div className="absolute top-[193px] left-[20px] -translate-x-1/2 -translate-y-1/2 opacity-0 animate-[fade-in_400ms_ease-out_forwards] [animation-delay:1000ms]">
                        <div className="w-8 h-8 rounded-full bg-accent-gold/30 animate-glow-pulse flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-accent-gold" />
                        </div>
                    </div>

                    <div className="absolute top-[193px] left-[220px] -translate-x-1/2 -translate-y-1/2 opacity-0 animate-[fade-in_400ms_ease-out_forwards] [animation-delay:1000ms]">
                        <div className="w-8 h-8 rounded-full bg-accent-gold/30 animate-glow-pulse flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-accent-gold" />
                        </div>
                    </div>

                    {/* Labels (Appear with glows) */}
                    <p className="absolute top-[-10px] left-[120px] -translate-x-1/2 font-inter font-semibold text-[15px] text-pine-dark opacity-0 animate-[fade-in_400ms_ease-out_forwards] [animation-delay:1000ms]">
                        Computation
                    </p>
                    <p className="absolute top-[210px] left-[20px] -translate-x-1/2 font-inter font-semibold text-[15px] text-pine-dark opacity-0 animate-[fade-in_400ms_ease-out_forwards] [animation-delay:1000ms]">
                        Literacy
                    </p>
                    <p className="absolute top-[210px] left-[220px] -translate-x-1/2 font-inter font-semibold text-[15px] text-pine-dark opacity-0 animate-[fade-in_400ms_ease-out_forwards] [animation-delay:1000ms]">
                        Confidence
                    </p>
                </div>

                {/* Body Copy */}
                <p className="font-inter text-[17px] text-pine-dark/90 leading-relaxed mb-12 opacity-0 animate-[fade-in_600ms_ease-out_forwards] [animation-delay:1200ms]">
                    Your knowledge for teaching spans three key areas. We'll map where you are&mdash;not to judge you, but to build your custom prep journey.
                </p>
            </div>

            {/* Navigation CTA (Bottom Fixed within AppShell) */}
            <div className="fixed bottom-0 left-0 w-full flex justify-center p-6 z-20 pointer-events-none">
                <div className="w-full max-w-[480px] flex flex-col space-y-4 pointer-events-auto bg-bone-white/90 backdrop-blur-sm pt-4 -mx-6 px-6 -mb-6 pb-6">
                    <Link
                        href="/onboarding/setup"
                        className="w-full bg-accent-green hover:bg-[#5aa177] active:scale-[0.98] transition-all duration-200 rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-md"
                    >
                        Got it — let&apos;s map me
                    </Link>
                    <Link
                        href="/welcome"
                        className="w-full flex justify-center text-[#8C8C8C] hover:text-pine-dark transition-colors font-inter font-semibold text-[16px]"
                    >
                        &larr; Back
                    </Link>
                </div>
            </div>
        </main>
    );
}
