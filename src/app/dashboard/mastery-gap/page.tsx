"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    BarChart3, 
    TrendingUp, 
    Target, 
    AlertTriangle, 
    CheckCircle2, 
    BookOpen, 
    Play,
    Info,
    ChevronRight,
    Search
} from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";
import triadData from "../../../data/triadData.json";

// --- Types ---
interface DomainStats {
    totalLessons: number;
    completedLessons: number;
    lessonMastery: number;
    testAccuracy: number;
    totalTestQuestions: number;
    correctTestQuestions: number;
    focusAreas: string[];
}

interface TestResult {
    scaledScore: number;
    rawPercent: number;
    domainPerformance: Record<string, { total: number; correct: number }>;
    questionsWithStatus: any[];
    timestamp: string;
}

const DOMAIN_METADATA: Record<string, { weight: string, focus: string[] }> = {
    "Functions & Calculus": {
        weight: "30%",
        focus: ["Inverses", "Logs", "Trig", "Limits", "Integrals"]
    },
    "Algebra": {
        weight: "20%",
        focus: ["Systems", "Polynomials", "Rational Eq"]
    },
    "Geometry": {
        weight: "20%",
        focus: ["Proofs", "Circles", "Transformations"]
    },
    "Number & Quantity": {
        weight: "15%",
        focus: ["Dimensional Analysis", "Matrices", "Vectors"]
    },
    "Statistics & Probability": {
        weight: "15%",
        focus: ["Outliers", "Empirical Rule", "Expected Value"]
    }
};

export default function MasteryGapAnalysis() {
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [lastTestResults, setLastTestResults] = useState<TestResult | null>(null);

    useEffect(() => {
        // Load data from localStorage
        const savedLessons = localStorage.getItem("mti_completed_lessons");
        if (savedLessons) setCompletedLessons(JSON.parse(savedLessons));

        const savedTest = localStorage.getItem("mti_last_test_results");
        if (savedTest) setLastTestResults(JSON.parse(savedTest));
    }, []);

    // --- Analytics Processing ---
    const domainStats = useMemo(() => {
        const stats: Record<string, DomainStats> = {};

        // 1. Initialize from Domain Metadata
        Object.keys(DOMAIN_METADATA).forEach(domain => {
            const domainLessons = triadData.filter(l => l.domain === domain);
            const domainCompleted = domainLessons.filter(l => completedLessons.includes(l.id));

            stats[domain] = {
                totalLessons: domainLessons.length,
                completedLessons: domainCompleted.length,
                lessonMastery: domainLessons.length > 0 ? (domainCompleted.length / domainLessons.length) * 100 : 0,
                testAccuracy: 0, // Default if no test taken
                totalTestQuestions: 0,
                correctTestQuestions: 0,
                focusAreas: DOMAIN_METADATA[domain].focus
            };
        });

        // 2. Overlay Test Performance
        if (lastTestResults) {
            Object.entries(lastTestResults.domainPerformance).forEach(([domain, data]) => {
                if (stats[domain]) {
                    stats[domain].totalTestQuestions = data.total;
                    stats[domain].correctTestQuestions = data.correct;
                    stats[domain].testAccuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
                }
            });
        }

        return stats;
    }, [completedLessons, lastTestResults]);

    const chartData = useMemo(() => {
        return Object.entries(domainStats).map(([domain, stats]) => ({
            domain: domain.split(" & ")[0], // Shorter labels for radar
            fullDomain: domain,
            Lessons: Math.round(stats.lessonMastery),
            Test: Math.round(stats.testAccuracy)
        }));
    }, [domainStats]);

    const overallLessonProgress = useMemo(() => {
        const total = triadData.length;
        const completed = completedLessons.length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }, [completedLessons]);

    // --- Gap Insight Logic ---
    const getGapInsight = (domain: string, stats: DomainStats) => {
        const delta = stats.lessonMastery - stats.testAccuracy;
        
        if (!lastTestResults) return "Complete a Practice Test to unlock performance gap analysis.";
        
        if (stats.lessonMastery > 80 && stats.testAccuracy < 60) {
            return `Performance Gap Detected: Your conceptual ${domain} knowledge is high (${Math.round(stats.lessonMastery)}%), but your execution in timed environments is stalling. Practice speed-drills for ${stats.focusAreas.slice(0, 2).join(" and ")}.`;
        }
        
        if (stats.lessonMastery < 40 && stats.testAccuracy < 40) {
            return `Growth Opportunity: Both mastery and performance are emerging. Focus on the core Lessons in ${domain} before attempting more high-stakes questions.`;
        }
        
        if (stats.testAccuracy >= 80) {
            return `Domain Mastery: You are consistently performing at an 'Exam Ready' level in ${domain}. Maintain this edge with periodic review.`;
        }
        
        if (delta > 20) {
            return `Application Gap: You understand the formulas in ${domain}, but struggle with Praxis-style distractors. Review the 'Student Work' analysis in your lessons.`;
        }

        return `Balanced Progress: Your developmental growth and test performance in ${domain} are aligned. Keep moving through the roadmap.`;
    };

    return (
        <div className="min-h-screen bg-bone-white font-inter text-pine-dark">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="font-playfair font-bold text-[20px] leading-tight text-pine-green">Mastery Gap Analysis</h1>
                        <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">Growth vs. Performance</p>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10">
                
                {/* --- Hero KPIs --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-pine-dark text-white rounded-3xl p-8 shadow-xl flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-white/60 text-[13px] font-bold uppercase tracking-widest mb-2">Overall Praxis Readiness</p>
                            <div className="flex items-baseline gap-3">
                                <h2 className="text-[64px] font-playfair font-bold">{lastTestResults?.scaledScore || "--"}</h2>
                                <span className="text-[18px] text-white/40 pb-4">/ 200</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 bg-white/10 w-fit px-3 py-1 rounded-full text-[12px] font-bold">
                                <TrendingUp size={14} className="text-accent-gold" />
                                <span>Based on most recent simulation</span>
                            </div>
                        </div>
                        <Target size={120} className="absolute right-[-20px] bottom-[-20px] text-white/5 group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-gray-400 text-[13px] font-bold uppercase tracking-widest mb-2">Total Lesson Progress</p>
                            <div className="flex items-baseline gap-3">
                                <h2 className="text-[64px] font-playfair font-bold text-pine-green">{overallLessonProgress}%</h2>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                                <div 
                                    className="h-full bg-pine-green transition-all duration-1000" 
                                    style={{ width: `${overallLessonProgress}%` }}
                                />
                            </div>
                            <p className="text-[12px] text-gray-400 font-medium mt-3">{completedLessons.length} of {triadData.length} developmental scenarios mastered</p>
                        </div>
                        <BarChart3 size={120} className="absolute right-[-20px] bottom-[-20px] text-gray-50 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>

                {/* --- Radar & Breakdown Section --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Radar Chart Panel */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-playfair font-bold text-[22px]">Performance Signature</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[12px] font-bold text-blue-600">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" /> Lessons
                                </div>
                                <div className="flex items-center gap-2 text-[12px] font-bold text-red-600">
                                    <div className="w-3 h-3 bg-red-500 rounded-full" /> Test
                                </div>
                            </div>
                        </div>

                        <div className="h-[450px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis 
                                        dataKey="domain" 
                                        tick={{ fill: "#6b7280", fontWeight: 700, fontSize: 12 }} 
                                    />
                                    <PolarRadiusAxis 
                                        angle={30} 
                                        domain={[0, 100]} 
                                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                                    />
                                    <Radar
                                        name="Lesson Mastery"
                                        dataKey="Lessons"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.1}
                                    />
                                    <Radar
                                        name="Test Performance"
                                        dataKey="Test"
                                        stroke="#ef4444"
                                        fill="#ef4444"
                                        fillOpacity={0.3}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Weight & Focus List */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
                        <h3 className="font-playfair font-bold text-[22px]">Domain Weights</h3>
                        <div className="space-y-6">
                            {Object.entries(domainStats).map(([domain, stats]) => (
                                <div key={domain} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-[14px]">{domain}</span>
                                        <span className="bg-sand-beige text-pine-dark px-2 py-0.5 rounded text-[11px] font-heavy">{DOMAIN_METADATA[domain].weight}</span>
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {stats.focusAreas.map(area => (
                                            <span key={area} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">{area}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-gray-100">
                            <Link href="/simulations" className="flex items-center justify-between group p-4 bg-pine-dark rounded-2xl text-white">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Next Step</p>
                                    <p className="font-bold">Retake Form A</p>
                                </div>
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* --- Gap Insight Panel --- */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-accent-gold" size={28} />
                        <h3 className="font-playfair font-bold text-[28px]">The Gap Insight Panel</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(domainStats).map(([domain, stats]) => {
                            const insight = getGapInsight(domain, stats);
                            const hasGap = insight.startsWith("Performance Gap");
                            
                            return (
                                <div 
                                    key={domain} 
                                    className={`p-6 rounded-3xl border-2 transition-all shadow-sm flex gap-5 ${
                                        hasGap ? "bg-red-50 border-red-100" : "bg-white border-gray-100 hover:border-pine-dark/20"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                        hasGap ? "bg-red-500 text-white" : "bg-pine-green/10 text-pine-green"
                                    }`}>
                                        {hasGap ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-pine-dark">{domain}</h4>
                                        <p className="text-[14px] leading-relaxed text-gray-600 font-medium">
                                            {insight}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* --- Remediation Roadmap --- */}
                <section className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-20">
                    <div className="bg-pine-dark text-white p-8">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-playfair font-bold text-[28px]">Remediation Roadmap</h3>
                            <div className="bg-white/10 px-4 py-2 rounded-xl text-[13px] font-bold">
                                {lastTestResults?.questionsWithStatus.filter(q => !q.isCorrect).length || 0} Targeted Review Areas
                            </div>
                        </div>
                        <p className="text-white/60 font-medium">Every missed question is a specific conceptual hole. Plug them below.</p>
                    </div>

                    {!lastTestResults ? (
                        <div className="p-20 text-center space-y-4">
                            <Search size={48} className="mx-auto text-gray-300" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest">No Performance Data Found</p>
                            <Link href="/simulator/form-a" className="inline-block bg-pine-dark text-white px-8 py-3 rounded-xl font-bold">Start Practice Test</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {lastTestResults.questionsWithStatus.filter(q => !q.isCorrect).map((q, i) => (
                                <div key={q.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black shrink-0 border border-red-100">
                                            !
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Question {lastTestResults.questionsWithStatus.findIndex(item => item.id === q.id) + 1}</span>
                                                <span className="text-[11px] font-bold text-pine-green bg-pine-green/5 px-2 py-0.5 rounded-full">{q.domain}</span>
                                            </div>
                                            <h4 className="font-bold text-pine-dark text-[17px]">{q.prompt}</h4>
                                            <p className="text-[14px] text-gray-500 italic">Incorrect: <span className="font-bold text-red-500 line-through">{q.userAnswer || "(Blank)"}</span> • Correct: <span className="font-bold text-pine-green">{q.correctAnswer}</span></p>
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/lesson/${q.remediationId}`}
                                        className="flex items-center gap-3 bg-white border-2 border-pine-green text-pine-green hover:bg-pine-green hover:text-white px-6 py-4 rounded-2xl font-bold text-[15px] transition-all shadow-sm shrink-0"
                                    >
                                        <Play size={18} fill="currentColor" />
                                        Review Mastery Case
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
