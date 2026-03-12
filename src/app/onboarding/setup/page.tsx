"use client";

import { useState } from "react";
import Link from "next/link";

export default function OnboardingSetup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        testDate: "",
        experience: "",
    });

    const isFormValid =
        formData.name.trim().length > 0 &&
        formData.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
        formData.testDate !== "" &&
        formData.experience !== "";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Top area - Progress + Content */}
            <div className="flex-1 flex flex-col px-6 pt-8 pb-32 relative z-10">
                {/* Progress Bar */}
                <div className="mb-8">
                    <p className="text-[13px] font-semibold text-pine-dark/60 mb-2 uppercase tracking-wide">
                        Step 2 of 3
                    </p>
                    <div className="w-full h-[6px] bg-pine-green/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-pine-green rounded-full w-2/3 transition-all duration-500 ease-out"
                        />
                    </div>
                </div>

                {/* Headline */}
                <h1 className="font-playfair font-bold text-[26px] text-pine-dark leading-snug mb-8">
                    Tell us a little about yourself
                </h1>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Name Field */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="font-inter font-semibold text-sm text-pine-dark">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="First name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-[10px] bg-white border border-gray-200 text-pine-dark font-inter text-base focus:outline-none focus:border-pine-green focus:ring-1 focus:ring-pine-green transition-all"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="font-inter font-semibold text-sm text-pine-dark">
                            Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-[10px] bg-white border border-gray-200 text-pine-dark font-inter text-base focus:outline-none focus:border-pine-green focus:ring-1 focus:ring-pine-green transition-all"
                        />
                    </div>

                    {/* Test Date (Select) */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="testDate" className="font-inter font-semibold text-sm text-pine-dark">
                            When are you planning to test?
                        </label>
                        <select
                            id="testDate"
                            name="testDate"
                            value={formData.testDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-[10px] bg-white border border-gray-200 text-pine-dark font-inter text-base focus:outline-none focus:border-pine-green focus:ring-1 focus:ring-pine-green transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%230E5546%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                        >
                            <option value="" disabled>Select timeframe</option>
                            <option value="within-30">Within 30 days</option>
                            <option value="1-3-months">1–3 months</option>
                            <option value="3-6-months">3–6 months</option>
                            <option value="6-plus">6+ months</option>
                        </select>
                    </div>

                    {/* Experience (Select) */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="experience" className="font-inter font-semibold text-sm text-pine-dark">
                            How long have you been teaching?
                        </label>
                        <select
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-[10px] bg-white border border-gray-200 text-pine-dark font-inter text-base focus:outline-none focus:border-pine-green focus:ring-1 focus:ring-pine-green transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%230E5546%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                        >
                            <option value="" disabled>Select experience</option>
                            <option value="pre-service">Pre-service</option>
                            <option value="0-2">0–2 years</option>
                            <option value="3-5">3–5 years</option>
                            <option value="6-plus">6+ years</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Navigation CTA (Bottom Fixed) */}
            <div className="fixed bottom-0 left-0 w-full flex justify-center p-6 z-20 pointer-events-none">
                <div className="w-full max-w-[480px] flex flex-col space-y-4 pointer-events-auto bg-bone-white/90 backdrop-blur-sm pt-4 -mx-6 px-6 -mb-6 pb-6">
                    <Link
                        href={isFormValid ? "/diagnostic/domain-ia/intro" : "#"}
                        onClick={(e) => !isFormValid && e.preventDefault()}
                        className={`w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-bone-white font-inter font-bold text-[18px] shadow-md transition-all duration-200 ${isFormValid
                            ? "opacity-100 active:scale-[0.98] hover:bg-pine-dark/90"
                            : "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        Start My Diagnostic &rarr;
                    </Link>
                    <p className="text-center font-inter text-[13px] text-gray-500 leading-relaxed">
                        Your data is private and used only to personalize your path.
                    </p>
                </div>
            </div>
        </main>
    );
}
