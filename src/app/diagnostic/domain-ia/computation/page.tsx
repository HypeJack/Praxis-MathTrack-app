"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function DiagnosticComputation() {
    const [formData, setFormData] = useState({
        simplifiedExpression: "",
        classification: "",
        recipeAnswer: "",
    });

    const isSubmittable =
        formData.simplifiedExpression.trim().length > 0 &&
        formData.classification !== "" &&
        formData.recipeAnswer.trim().length > 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const insertSymbol = (symbol: string) => {
        setFormData((prev) => ({
            ...prev,
            simplifiedExpression: prev.simplifiedExpression + symbol,
        }));
    };

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Step 1: Diagnostic Navigation Shell */}
            <header className="bg-pine-green w-full z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <Link href="/diagnostic/domain-ia/intro" className="text-bone-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </Link>
                    <span className="font-inter font-semibold text-[15px] text-bone-white">
                        Step 2 of 16
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[8px] bg-bone-white relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-500 ease-out"
                        style={{ width: "12%" }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
                {/* Step 2: Task Typography & Badging */}
                <div className="flex flex-col items-start space-y-4 mb-6">
                    <div className="bg-bone-white px-3 py-1 rounded-full border border-gray-200">
                        <span className="font-inter font-bold text-[13px] text-pine-green uppercase tracking-wider">
                            COMPUTATION &middot; DOMAIN I-A
                        </span>
                    </div>
                    <h1 className="font-playfair font-bold text-[26px] text-pine-green leading-tight">
                        Let&apos;s see how you work with this.
                    </h1>
                </div>

                {/* Task Cards Container */}
                <div className="space-y-6">
                    {/* Card 1: Simplification & Classification */}
                    <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col space-y-6 shadow-sm">
                        <div className="flex flex-col space-y-2">
                            <p className="font-inter text-[15px] text-gray-500 font-medium">Simplify:</p>
                            <p className="font-inter font-bold text-[22px] text-pine-green">
                                &radic;48 + &radic;75 &minus; 2&radic;3
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="simplifiedExpression" className="font-inter font-semibold text-sm text-pine-green">
                                    Simplified expression:
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        id="simplifiedExpression"
                                        name="simplifiedExpression"
                                        placeholder="e.g., 9&radic;3"
                                        value={formData.simplifiedExpression}
                                        onChange={handleInputChange}
                                        className="flex-1 px-4 py-3 rounded-l-md bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark font-inter text-base transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => insertSymbol("√")}
                                        className="bg-pine-green/10 hover:bg-pine-green/20 px-4 py-[10px] rounded-r-md border-t border-r border-b border-transparent hover:border-pine-green/30 text-pine-green font-inter font-bold text-lg transition-all"
                                    >
                                        √
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="classification" className="font-inter font-semibold text-sm text-pine-green">
                                    Is the result rational or irrational?
                                </label>
                                <select
                                    id="classification"
                                    name="classification"
                                    value={formData.classification}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark font-inter text-base transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%230E5546%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                                >
                                    <option value="">Select...</option>
                                    <option value="rational">Rational</option>
                                    <option value="irrational">Irrational</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Proportional Reasoning */}
                    <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col space-y-6 shadow-sm">
                        <p className="font-inter text-[17px] text-pine-dark leading-relaxed">
                            A recipe needs &frac34; cup sugar per 2 dozen cookies. How much sugar for 15 dozen?
                        </p>

                        <div className="flex flex-col space-y-2">
                            <input
                                type="text"
                                name="recipeAnswer"
                                placeholder="Enter your answer..."
                                value={formData.recipeAnswer}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark font-inter text-base transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Area */}
                <div className="mt-auto pt-10">
                    <Link
                        href={isSubmittable ? "/diagnostic/domain-ia/receptive" : "#"}
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
