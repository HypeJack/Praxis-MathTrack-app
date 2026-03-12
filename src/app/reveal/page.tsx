"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { TriadTriangle } from "@/components/TriadTriangle";
import { PERSONA_DATA } from "@/data/personas";
import { DOMAIN_METADATA } from "@/data/domains";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function RevealPage() {
    const { isComplete, triadPosition, persona: personaKey, pathPriority } = useDiagnosticStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Simple hydration check
        setIsHydrated(true);
    }, []);

    // HYDRATION GUARD: Prevents rendering before store is synced or if diagnostic isn't finished
    if (!isHydrated || !isComplete || !triadPosition || !personaKey) {
        return <LoadingScreen />;
    }

    const persona = PERSONA_DATA[personaKey];
    const topDomain = pathPriority[0] ? DOMAIN_METADATA[pathPriority[0]] : DOMAIN_METADATA['ii'];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" as const }
        }
    };

    return (
        <main className="w-full min-h-[100dvh] bg-bone-white flex flex-col font-inter">
            {/* Standard Nav */}
            <header className="bg-pine-green w-full z-20 shadow-sm sticky top-0">
                <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
                    <Image 
                        src="/White MathTrack Institute Logo.png" 
                        alt="MathTrack Logo" 
                        width={140} 
                        height={30} 
                        className="h-7 w-auto object-contain" 
                    />
                    <div className="flex items-center space-x-3">
                        <Link href="/profile" className="hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-bone-white/20 flex items-center justify-center">
                                <User size={18} className="text-bone-white" />
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            <motion.div 
                className="flex-1 flex flex-col w-full max-w-2xl mx-auto mt-8 px-6 pb-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Section 1: The Identity Reveal */}
                <motion.div variants={itemVariants} className="mb-8">
                    <span className="text-accent-gold font-bold uppercase tracking-widest text-[12px] mb-2 block">
                        Diagnostic Complete
                    </span>
                    <h1 className="font-playfair font-bold text-[36px] text-pine-green leading-tight">
                        You are {persona.name}.
                    </h1>
                </motion.div>

                {/* Section 2: The Triad Triangle */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col items-center">
                        <TriadTriangle position={triadPosition} />
                        <div className="mt-4 text-center">
                            <h3 className="font-playfair font-bold text-[20px] text-pine-green">Your Triad Position</h3>
                            <p className="text-[14px] text-pine-dark/60 italic mt-1">
                                Mapping your computation, literacy, and confidence.
                            </p>
                        </div>
                    </div>
                    {/* Subtle aesthetic background shape */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl -mr-16 -mt-16" />
                </motion.div>

                {/* Section 3: The Profile Details */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-pine-dark text-white rounded-3xl p-8 shadow-xl relative overflow-hidden mb-8"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">
                                {persona.icon}
                            </div>
                            <div>
                                <h2 className="text-[24px] font-playfair font-bold">{persona.name}</h2>
                                <p className="text-accent-gold text-[13px] font-bold uppercase tracking-widest">Mastery Archetype</p>
                            </div>
                        </div>

                        <p className="text-[20px] font-medium leading-relaxed italic mb-8 border-l-2 border-accent-gold pl-6 py-2">
                            "{persona.tagline}"
                        </p>
                        
                        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-white/10">
                            <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">Core Strength</h4>
                                <p className="text-[16px] leading-relaxed text-bone-white">{persona.strength}</p>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">Focus Area</h4>
                                <p className="text-[16px] leading-relaxed text-bone-white">{persona.focusArea}</p>
                            </div>
                        </div>
                    </div>
                    <Sparkles className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64" />
                </motion.div>

                {/* Section 4: Strategy & Next Steps */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <div className="bg-white border boundary-accent-gold/30 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-bold text-pine-green flex items-center gap-2 mb-3">
                            <Sparkles size={18} className="text-accent-gold" />
                            Your Personalized Strategy
                        </h4>
                        <p className="text-[16px] text-pine-dark leading-relaxed">
                            {persona.strategy}
                        </p>
                    </div>

                    <Link
                        href="/path-unlock"
                        className="group w-full bg-pine-dark rounded-[16px] py-5 px-8 flex items-center justify-between text-white font-inter font-bold text-[18px] shadow-2xl transition-all duration-300 hover:bg-pine-green active:scale-[0.98]"
                    >
                        <span>Unlock {topDomain.name}</span>
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <ArrowRight size={22} />
                        </motion.div>
                    </Link>
                </motion.div>
            </motion.div>
        </main>
    );
}
