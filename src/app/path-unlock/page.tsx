"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, CheckCircle2, Lock, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { DOMAIN_METADATA } from "@/data/domains";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function PathUnlockPage() {
    const { isComplete, pathPriority, triadPosition, persona: personaKey } = useDiagnosticStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // HYDRATION GUARD
    if (!isHydrated || !isComplete || pathPriority.length === 0) {
        return <LoadingScreen message="Unlocking your learning path..." />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.4
            }
        }
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" as const }
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

            <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto mt-8 px-6 pb-24">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-accent-green/10 text-accent-green px-4 py-1.5 rounded-full border border-accent-green/20 mb-4">
                        <ShieldCheck size={16} />
                        <span className="font-bold text-[12px] uppercase tracking-widest">Diagnostic Verified</span>
                    </div>
                    <h1 className="font-playfair font-bold text-[32px] text-pine-green leading-tight mb-3">
                        Your Custom Learning Path
                    </h1>
                    <p className="text-pine-dark/70 text-[16px] max-w-[400px] mx-auto">
                        Based on your profile, we've sequenced your mastery goals for maximum effectiveness.
                    </p>
                </motion.div>

                {/* Priority Cards List */}
                <motion.div 
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {pathPriority.map((domainKey, index) => {
                        const domain = DOMAIN_METADATA[domainKey];
                        const isTopPriority = index === 0;

                        return (
                            <motion.div 
                                key={domainKey} 
                                variants={cardVariants}
                                className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                                    isTopPriority 
                                    ? 'bg-white border-pine-green shadow-md scale-[1.02] z-10' 
                                    : 'bg-white/60 border-gray-200 shadow-sm hover:border-pine-green/30'
                                }`}
                            >
                                {isTopPriority && (
                                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-pine-dark text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                        <Zap size={10} className="text-accent-gold" />
                                        Primary Focus
                                    </div>
                                )}

                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[14px] font-bold text-gray-400 font-mono">#{index + 1}</span>
                                            <h3 className="font-playfair font-bold text-[20px] text-pine-green">
                                                {domain.name}
                                            </h3>
                                        </div>
                                        <p className="text-[14px] text-pine-dark/60 leading-relaxed max-w-[340px]">
                                            {domain.description}
                                        </p>
                                    </div>

                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Praxis Weight</span>
                                        <span className="text-[18px] font-bold text-pine-dark">{domain.weight}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Target</span>
                                            <span className="text-[14px] font-bold text-pine-green">{domain.masteryTarget} Mastery</span>
                                        </div>
                                    </div>
                                    
                                    {isTopPriority ? (
                                        <div className="flex items-center gap-1 text-accent-green font-bold text-[13px]">
                                            <CheckCircle2 size={16} />
                                            Unlocked
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-gray-400 font-bold text-[13px]">
                                            <Lock size={14} />
                                            Queued
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Final CTA */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-12"
                >
                    <Link
                        href="/dashboard"
                        className="group w-full bg-pine-dark rounded-[16px] py-5 px-8 flex items-center justify-center gap-3 text-white font-inter font-bold text-[18px] shadow-2xl transition-all duration-300 hover:bg-pine-green active:scale-[0.98]"
                    >
                        <span>Start My Journey</span>
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-center text-gray-400 text-[13px] mt-4 font-inter">
                        You can always adjust your focus from the Dashboard.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
