"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Target, GraduationCap, ChevronRight } from "lucide-react";

export default function ProfilePage() {
    const domains = [
        { name: "Algebra", score: 80, color: "bg-accent-green" },
        { name: "Geometry", score: 45, color: "bg-highlight-terracotta", note: "Needs Focus" },
        { name: "Functions & Calculus", score: 65, color: "bg-accent-green" },
        { name: "Stats & Probability", score: 50, color: "bg-accent-gold" },
        { name: "Number & Quantity", score: 90, color: "bg-accent-green" },
    ];

    return (
        <main className="min-h-screen bg-bone-white font-inter">
            <div className="max-w-4xl mx-auto p-6">
                
                {/* Back Link */}
                <Link 
                    href="/dashboard" 
                    className="inline-flex items-center gap-2 text-pine-green font-semibold hover:underline mb-8 transition-all"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                {/* Task 1: Header Section */}
                <header className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-full bg-highlight-terracotta text-white flex items-center justify-center text-3xl font-bold shadow-lg shrink-0">
                        JS
                    </div>
                    <div>
                        <h1 className="font-playfair text-[32px] font-bold text-pine-green leading-tight">
                            Jordan Smith
                        </h1>
                        <p className="text-gray-600 text-[18px]">
                            High School Math Teacher
                        </p>
                    </div>
                </header>

                {/* Task 2: Diagnostic Persona Card */}
                <section className="bg-pine-green text-bone-white p-8 rounded-2xl shadow-xl mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <GraduationCap size={120} />
                    </div>
                    <h2 className="font-playfair text-[28px] font-bold mb-4 relative z-10">
                        Learner Persona: The Stealth Scholar
                    </h2>
                    <p className="text-[17px] leading-relaxed opacity-90 max-w-[700px] relative z-10">
                        You possess strong foundational procedural knowledge but tend to internalize your reasoning. 
                        Your customized GROWTH path focuses on Layering Literacy—translating your internal calculations 
                        into explicit, accessible narratives for your students.
                    </p>
                </section>

                {/* Task 3: Readiness & Domain Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Column 1: Overall Readiness */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                        <h3 className="font-inter font-bold text-[14px] uppercase tracking-wider text-gray-500 mb-6">
                            Praxis 5165 Readiness
                        </h3>
                        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-gray-100"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * 72) / 100}
                                    className="text-accent-green"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-[42px] font-bold text-pine-green">72%</span>
                        </div>
                        <p className="text-gray-600 font-medium">
                            Overall Readiness Score
                        </p>
                    </div>

                    {/* Column 2: Domain Mastery */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-inter font-bold text-[14px] uppercase tracking-wider text-gray-500 mb-6">
                            Domain Breakdown
                        </h3>
                        <div className="space-y-6">
                            {domains.map((domain) => (
                                <div key={domain.name} className="space-y-2">
                                    <div className="flex justify-between items-center text-[14px] font-semibold">
                                        <span className="text-pine-dark">{domain.name}</span>
                                        <div className="flex items-center gap-2">
                                            {domain.note && (
                                                <span className="text-[11px] font-bold text-highlight-terracotta uppercase tracking-tighter">
                                                    {domain.note}
                                                </span>
                                            )}
                                            <span className="text-pine-green">{domain.score}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${domain.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${domain.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="mt-16 text-center text-gray-400 text-[14px] pb-12">
                    MathTrack Institute &copy; 2024 • Professional Learning Journey
                </footer>
            </div>
        </main>
    );
}
