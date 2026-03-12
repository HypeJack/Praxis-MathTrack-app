"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
    Clock, 
    Flag, 
    ChevronLeft, 
    ChevronRight, 
    CheckCircle2, 
    AlertCircle, 
    ArrowLeft,
    BarChart3,
    BookOpen,
    Play
} from "lucide-react";
import practiceTests from "../../../data/practiceTests.json";

// --- Types ---
interface Question {
    id: string;
    domain: string;
    questionType: string;
    prompt: string;
    options?: string[];
    correctAnswer: string;
    remediationId: string;
}

interface TestData {
    testId: string;
    title: string;
    description: string;
    questions: Question[];
}

// --- Helper: Format Time ---
const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function TestSimulator() {
    const params = useParams();
    const router = useRouter();
    const testId = params.testId as string;
    
    // Find test data
    const testData = useMemo(() => 
        (practiceTests as TestData[]).find(t => t.testId === testId) || practiceTests[0]
    , [testId]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const [timeLeft, setTimeLeft] = useState(180 * 60); // 180 minutes in seconds
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Persistence: Load from sessionStorage on mount
    useEffect(() => {
        const savedAnswers = sessionStorage.getItem("mti_simulator_answers");
        if (savedAnswers) {
            try {
                setUserAnswers(JSON.parse(savedAnswers));
            } catch (e) {
                console.error("Failed to parse saved answers", e);
            }
        }
    }, []);

    // Persistence: Save to sessionStorage on change
    useEffect(() => {
        if (Object.keys(userAnswers).length > 0) {
            sessionStorage.setItem("mti_simulator_answers", JSON.stringify(userAnswers));
        }
    }, [userAnswers]);

    // --- Lock Logic: Disable Back Button ---
    useEffect(() => {
        if (isSubmitted) return;

        const preventBack = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", preventBack);

        return () => window.removeEventListener("popstate", preventBack);
    }, [isSubmitted]);

    // Timer Effect
    useEffect(() => {
        if (isSubmitted || timeLeft <= 0) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isSubmitted]);

    // Current Question
    const currentQuestion = testData.questions[currentIndex];

    // --- Handlers ---
    const handleAnswer = (val: string) => {
        // Numeric Entry Validation: Only allow numbers and decimal points
        if (currentQuestion.questionType === "Numeric Entry") {
            const cleaned = val.replace(/[^0-9.]/g, '');
            // Prevent multiple decimals
            if ((cleaned.match(/\./g) || []).length > 1) return;
            setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: cleaned }));
        } else {
            setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
        }
    };

    const toggleMark = () => {
        setMarkedForReview(prev => {
            const next = new Set(prev);
            if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
            else next.add(currentQuestion.id);
            return next;
        });
    };

    const handleSubmit = () => {
        const unansweredCount = testData.questions.length - Object.keys(userAnswers).length;
        const msg = unansweredCount > 0 
            ? `You have ${unansweredCount} unanswered questions. Are you sure you want to submit the full exam?`
            : "Are you sure you want to submit the full exam?";
            
        if (confirm(msg)) {
            setIsSubmitted(true);
            sessionStorage.removeItem("mti_simulator_answers"); // Clear backup on submission
            
            // Handled in results memo useEffect-like pattern or just here
        }
    };

    // --- Scoring Logic ---
    const results = useMemo(() => {
        if (!isSubmitted) return null;

        let correctCount = 0;
        const domainPerformance: Record<string, { total: number; correct: number }> = {};
        const missedRemediationIds: string[] = [];

        const questionsWithStatus = testData.questions.map(q => {
            const isCorrect = userAnswers[q.id] === q.correctAnswer;
            if (isCorrect) correctCount++;
            else if (q.remediationId) missedRemediationIds.push(q.remediationId);

            if (!domainPerformance[q.domain]) {
                domainPerformance[q.domain] = { total: 0, correct: 0 };
            }
            domainPerformance[q.domain].total++;
            if (isCorrect) domainPerformance[q.domain].correct++;

            return { ...q, isCorrect, userAnswer: userAnswers[q.id] };
        });

        const maxQuestions = testData.questions.length;
        const rawPercent = (correctCount / maxQuestions);
        const scaledScore = Math.round(rawPercent * 100 + 100);

        // Gauge Color
        let gaugeColor = "bg-highlight-terracotta"; // Red
        if (scaledScore >= 160) gaugeColor = "bg-pine-green"; // Green
        else if (scaledScore >= 145) gaugeColor = "bg-accent-gold"; // Yellow

        const finalResults = {
            correctCount,
            totalCount: maxQuestions,
            rawPercent,
            scaledScore,
            domainPerformance,
            questionsWithStatus,
            gaugeColor,
            timestamp: new Date().toISOString()
        };

        // Persistence: Save snapshot for Mastery Gap Analysis
        localStorage.setItem("mti_last_test_results", JSON.stringify(finalResults));

        // Persistence: Save missed IDs to localStorage for Domain Bridge
        if (missedRemediationIds.length > 0) {
            const existing = JSON.parse(localStorage.getItem("mti_needs_review_lessons") || "[]");
            const combined = Array.from(new Set([...existing, ...missedRemediationIds]));
            localStorage.setItem("mti_needs_review_lessons", JSON.stringify(combined));
        }

        return finalResults;
    }, [isSubmitted, userAnswers, testData]);

    if (isSubmitted && results) {
        return (
            <div className="min-h-screen bg-bone-white p-6 md:p-10 font-inter">
                <div className="max-w-[850px] mx-auto space-y-10">
                    <header className="text-center space-y-4">
                        <h1 className="font-playfair font-bold text-[36px] text-pine-green">Exam Results</h1>
                        <p className="text-gray-600 font-medium">{testData.title} &mdash; Simulation Results</p>
                    </header>

                    {/* Scaled Score & Performance Gauge */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl relative overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="text-center md:text-left flex-1">
                                <p className="uppercase tracking-widest text-[12px] font-bold text-gray-400 mb-2">Projected Scaled Score</p>
                                <h2 className="text-[80px] font-playfair font-bold text-pine-dark leading-none">{results.scaledScore}</h2>
                                <p className="text-gray-500 font-medium mt-3">
                                    Raw Accuracy: {Math.round(results.rawPercent * 100)}% ({results.correctCount}/{results.totalCount})
                                </p>
                            </div>
                            
                            {/* Performance Gauge */}
                            <div className="w-full md:w-[350px] space-y-4">
                                <div className="flex justify-between text-[13px] font-bold uppercase tracking-wider">
                                    <span className="text-highlight-terracotta">Needs Work</span>
                                    <span className="text-pine-green">Exam Ready</span>
                                </div>
                                <div className="h-8 w-full bg-gray-100 rounded-full p-1.5 relative shadow-inner">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 shadow-sm ${results.gaugeColor}`} 
                                        style={{ width: `${Math.max(8, results.rawPercent * 100)}%` }}
                                    />
                                    {/* Score Marker */}
                                    <div 
                                        className="absolute top-[-10px] bottom-[-10px] w-1.5 bg-pine-dark shadow-lg z-10 transition-all duration-1000"
                                        style={{ left: `${results.rawPercent * 100}%` }}
                                    />
                                </div>
                                <p className="text-center text-[14px] font-semibold text-pine-dark italic pt-2 px-4 leading-snug">
                                    {results.scaledScore >= 160 
                                        ? "Excellent work! You are trending toward a passing Praxis score." 
                                        : "You're making progress. Target a score of 160+ for optimal confidence."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Domain Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                        <h3 className="font-inter font-bold text-[18px] text-pine-dark mb-8 flex items-center gap-2">
                            <BarChart3 size={20} className="text-pine-green" />
                            Domain Performance Analysis
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {Object.entries(results.domainPerformance).map(([domain, data]) => {
                                const percent = Math.round((data.correct / data.total) * 100);
                                return (
                                    <div key={domain} className="space-y-3">
                                        <div className="flex justify-between text-[14px] font-bold">
                                            <span className="text-pine-dark">{domain}</span>
                                            <span className={percent >= 70 ? "text-pine-green" : percent >= 50 ? "text-accent-gold" : "text-highlight-terracotta"}>
                                                {percent}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${
                                                    percent >= 70 ? "bg-pine-green" : percent >= 50 ? "bg-accent-gold" : "bg-highlight-terracotta"
                                                }`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <p className="text-[11px] text-gray-400 font-medium">
                                            {data.correct} of {data.total} tasks mastered in this domain
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Full Question Review */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-pine-dark text-white px-8 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen size={22} />
                                <h3 className="font-bold text-[18px]">Detailed Question Review</h3>
                            </div>
                            <div className="flex gap-4 text-[12px] font-bold uppercase tracking-widest opacity-80">
                                <span>Total: {results.totalCount}</span>
                                <span className="text-green-400">Correct: {results.correctCount}</span>
                                <span className="text-red-400">Incorrect: {results.totalCount - results.correctCount}</span>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto custom-scrollbar">
                            {results.questionsWithStatus.map((q, i) => (
                                <div key={q.id} className={`p-8 flex flex-col md:flex-row md:items-start justify-between gap-6 transition-colors ${!q.isCorrect ? "bg-highlight-terracotta/5" : "hover:bg-gray-50/50"}`}>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-[15px] text-gray-400 bg-gray-100 w-8 h-8 rounded flex items-center justify-center">{i + 1}</span>
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${
                                                q.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}>
                                                {q.isCorrect ? "Correct" : "Incorrect"}
                                            </span>
                                            <span className="text-[12px] text-gray-500 font-semibold uppercase tracking-wider">{q.domain}</span>
                                        </div>
                                        <h4 className="font-inter font-bold text-pine-dark text-[17px] leading-relaxed">{q.prompt}</h4>
                                        {!q.isCorrect && (
                                            <div className="flex flex-col gap-1 pt-2">
                                                <p className="text-[14px] text-highlight-terracotta font-medium">
                                                    Your Answer: <span className="font-heavy">{q.userAnswer || "(Unanswered)"}</span>
                                                </p>
                                                <p className="text-[14px] text-pine-green font-medium">
                                                    Correct Key: <span className="font-heavy">{q.correctAnswer}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {!q.isCorrect && (
                                        <Link 
                                            href={`/lesson/${q.remediationId}`}
                                            className="flex items-center gap-2 bg-pine-green text-white hover:bg-pine-dark px-6 py-3 rounded-xl font-bold text-[14px] transition-all whitespace-nowrap shadow-md self-start"
                                        >
                                            <Play size={16} className="fill-current" />
                                            Bridge This Gap
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 pt-4">
                        <Link 
                            href="/dashboard"
                            className="flex-1 bg-white border-2 border-pine-green text-pine-green py-5 rounded-2xl font-bold text-[18px] flex items-center justify-center gap-3 hover:bg-pine-green/5 transition-all shadow-sm"
                        >
                            <ArrowLeft size={22} />
                            Exit to Dashboard
                        </Link>
                        <button 
                            onClick={() => window.location.reload()}
                            className="flex-1 bg-pine-dark text-white py-5 rounded-2xl font-bold text-[18px] flex items-center justify-center gap-3 hover:bg-pine-dark/90 transition-all shadow-lg active:scale-[0.98]"
                        >
                            <Clock size={22} />
                            Reset & Retake
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bone-white font-inter flex flex-col overflow-hidden">
            {/* --- Simulator Header --- */}
            <header className="bg-pine-green text-bone-white px-6 py-4 flex items-center justify-between shadow-md z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard')} className="hover:opacity-70 transition-opacity">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="font-playfair font-bold text-[18px] leading-none mb-1">{testData.title}</h1>
                        <p className="text-[12px] opacity-70 uppercase tracking-wider font-semibold">Distraction-Free Mode</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                        <Clock size={18} className="text-accent-gold" />
                        <span className="font-mono font-bold text-[18px]">{formatTime(timeLeft)}</span>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="bg-accent-gold hover:bg-accent-gold/90 text-pine-dark px-6 py-2 rounded-lg font-bold text-[14px] transition-all shadow-sm"
                    >
                        Submit Full Exam
                    </button>
                </div>
            </header>

            {/* --- Main Workspace --- */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left: Question Area */}
                <div className="flex-1 overflow-y-auto bg-white p-8 md:p-12">
                    <div className="max-w-[700px] mx-auto space-y-10">
                        <div className="space-y-4">
                            <span className="bg-sand-beige text-pine-dark px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
                                Question {currentIndex + 1} of {testData.questions.length} • {currentQuestion.domain}
                            </span>
                            <h2 className="text-[24px] font-playfair font-bold text-pine-dark leading-snug">
                                {currentQuestion.prompt}
                            </h2>
                        </div>

                        {/* Answer Input */}
                        <div className="space-y-4">
                            {currentQuestion.questionType === "Multiple Choice" ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {currentQuestion.options?.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(opt)}
                                            className={`p-5 rounded-xl border-2 text-left font-medium transition-all flex items-center justify-between group ${
                                                userAnswers[currentQuestion.id] === opt
                                                    ? "border-accent-gold bg-accent-gold/5 text-pine-dark"
                                                    : "border-gray-100 bg-gray-50/30 hover:border-accent-gold/30"
                                            }`}
                                        >
                                            <span className="flex-1">{opt}</span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                userAnswers[currentQuestion.id] === opt 
                                                ? "border-accent-gold bg-accent-gold" 
                                                : "border-gray-200 group-hover:border-accent-gold/50"
                                            }`}>
                                                {userAnswers[currentQuestion.id] === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <label className="block text-[14px] font-bold text-gray-500 uppercase tracking-wider">Numeric Entry</label>
                                    <input 
                                        type="text"
                                        placeholder="Enter your answer..."
                                        className="w-full p-5 rounded-xl border-2 border-gray-100 bg-gray-50/30 focus:border-accent-gold focus:outline-none font-mono text-[18px] text-pine-dark transition-all"
                                        value={userAnswers[currentQuestion.id] || ""}
                                        onChange={(e) => handleAnswer(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-10 border-t border-gray-100">
                            <button
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-pine-green hover:bg-pine-green/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                                Previous
                            </button>

                            <button
                                onClick={toggleMark}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                                    markedForReview.has(currentQuestion.id)
                                        ? "bg-highlight-terracotta text-white shadow-md"
                                        : "text-gray-400 hover:text-highlight-terracotta hover:bg-highlight-terracotta/5"
                                }`}
                            >
                                <Flag size={20} className={markedForReview.has(currentQuestion.id) ? "fill-white" : ""} />
                                {markedForReview.has(currentQuestion.id) ? "Marked for Review" : "Mark for Review"}
                            </button>

                            <button
                                onClick={() => setCurrentIndex(prev => Math.min(testData.questions.length - 1, prev + 1))}
                                disabled={currentIndex === testData.questions.length - 1}
                                className="flex items-center gap-2 px-10 py-3 rounded-xl bg-pine-dark text-white font-bold shadow-md hover:bg-pine-dark/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Question Map & nav */}
                <aside className="w-[320px] bg-bone-white border-l border-gray-200 overflow-y-auto p-6 space-y-8 hidden lg:block">
                    <div className="space-y-4">
                        <h3 className="font-inter font-bold text-[14px] text-pine-dark uppercase tracking-wider flex items-center gap-2">
                            <BookOpen size={16} />
                            Question Map
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                            {testData.questions.map((q, i) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-full aspect-square rounded-lg flex items-center justify-center font-bold text-[14px] transition-all border-2 ${
                                        currentIndex === i
                                            ? "border-pine-dark bg-pine-dark text-white ring-2 ring-pine-dark/20 ring-offset-1"
                                            : markedForReview.has(q.id)
                                            ? "border-highlight-terracotta bg-highlight-terracotta/10 text-highlight-terracotta"
                                            : userAnswers[q.id]
                                            ? "border-pine-green bg-pine-green/10 text-pine-green"
                                            : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4 shadow-sm">
                        <h4 className="font-bold text-[13px] uppercase text-gray-400 tracking-widest">Legend</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                                <div className="w-4 h-4 rounded bg-pine-dark" /> Current Question
                            </div>
                            <div className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                                <div className="w-4 h-4 rounded bg-pine-green/20 border-2 border-pine-green text-pine-green" /> Complete (Answered)
                            </div>
                            <div className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                                <div className="w-4 h-4 rounded bg-highlight-terracotta/20 border-2 border-highlight-terracotta text-highlight-terracotta" /> Marked for Review
                            </div>
                            <div className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                                <div className="w-4 h-4 rounded bg-white border-2 border-gray-200" /> Untested
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
