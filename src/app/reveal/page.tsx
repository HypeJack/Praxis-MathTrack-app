import Link from "next/link";
import Image from "next/image";
import MathTrackLogo from "@/assets/logo.png";
import { User } from "lucide-react";

export default function RevealPage() {
    return (
        <main className="w-full min-h-[100dvh] bg-bone-white flex flex-col font-inter">
            {/* Step 1: Standard Top Nav Bar */}
            <header className="bg-pine-green w-full z-20 shadow-sm relative">
                <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
                    <Image src={MathTrackLogo} alt="MathTrack Logo" width={140} height={30} className="h-7 w-auto object-contain" />
                    <div className="flex items-center space-x-3">
                        <Link href="/profile" className="hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-bone-white/20 flex items-center justify-center">
                                <User size={18} className="text-bone-white" />
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Areas */}
            <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto mt-12 px-6">

                {/* Step 2: Typography & Content */}
                <h1 className="font-playfair font-bold text-[32px] text-pine-green mb-4 leading-tight">
                    Analyzing your pedagogical profile...
                </h1>

                <p className="font-inter text-[17px] text-gray-700 mb-8 leading-relaxed">
                    To master the Praxis 5165, you need more than just computation skills. We evaluate your data across four distinct pillars to assign you one of our MathTrack Personas:
                </p>

                {/* Step 3: The Persona Explainer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Card 1 */}
                    <div className="bg-white border border-gray-200 rounded-[12px] p-5 shadow-sm">
                        <h3 className="font-inter font-bold text-[16px] text-pine-dark flex items-center mb-2">
                            <span className="text-xl mr-2">🦉</span> Stealth Scholar
                        </h3>
                        <p className="font-inter text-[14px] text-gray-600">
                            High skill, low confidence. Needs speed drills.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-gray-200 rounded-[12px] p-5 shadow-sm">
                        <h3 className="font-inter font-bold text-[16px] text-pine-dark flex items-center mb-2">
                            <span className="text-xl mr-2">🎤</span> Math Narrator
                        </h3>
                        <p className="font-inter text-[14px] text-gray-600">
                            High literacy, low computation. Needs fluency practice.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white border border-gray-200 rounded-[12px] p-5 shadow-sm">
                        <h3 className="font-inter font-bold text-[16px] text-pine-dark flex items-center mb-2">
                            <span className="text-xl mr-2">🏗️</span> Bold Builder
                        </h3>
                        <p className="font-inter text-[14px] text-gray-600">
                            High confidence, foundational gaps. Needs core reality checks.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white border border-gray-200 rounded-[12px] p-5 shadow-sm">
                        <h3 className="font-inter font-bold text-[16px] text-pine-dark flex items-center mb-2">
                            <span className="text-xl mr-2">🔍</span> Foundation Finder
                        </h3>
                        <p className="font-inter text-[14px] text-gray-600">
                            Low confidence, low literacy. Needs step-by-step rebuilding.
                        </p>
                    </div>
                </div>

                {/* Step 4: The Reveal CTA */}
                <div className="mt-12 pb-12">
                    <Link
                        href="/dashboard"
                        className="w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-lg transition-all duration-200 active:scale-[0.98] hover:bg-pine-dark/90"
                    >
                        Reveal My Persona &rarr;
                    </Link>
                </div>

            </div>
        </main>
    );
}
