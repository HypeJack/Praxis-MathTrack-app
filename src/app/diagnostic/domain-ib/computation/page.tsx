"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function AlgebraComputation() {
    const [xValue, setXValue] = useState("");
    const [yValue, setYValue] = useState("");
    const [graphicalRepresentation, setGraphicalRepresentation] = useState("");
    const [factoredForm, setFactoredForm] = useState("");

    const handleFactoredInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFactoredForm(e.target.value);
    };

    const appendExponent = () => {
        setFactoredForm((prev) => prev + "²");
    };

    const isSubmittable =
        xValue.trim().length > 0 &&
        yValue.trim().length > 0 &&
        graphicalRepresentation !== "" &&
        factoredForm.trim().length > 0;

    return (
        <main className="w-full max-w-[480px] min-h-[100dvh] mx-auto flex flex-col bg-bone-white font-inter relative shadow-xl overflow-x-hidden">
            {/* Step 1: Diagnostic Navigation Shell */}
            <header className="bg-pine-green w-full z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <Link href="/diagnostic/domain-ib/intro" className="text-bone-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </Link>
                    <span className="font-inter font-semibold text-[15px] text-bone-white">
                        Step 7 of 16
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[8px] bg-bone-white relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-500 ease-out"
                        style={{ width: "44%" }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
                {/* Step 2: Task Typography & Badging */}
                <div className="flex flex-col items-start space-y-4 mb-6">
                    <div className="bg-bone-white px-3 py-1 rounded-full border border-gray-200">
                        <span className="font-inter font-bold text-[13px] text-pine-green uppercase tracking-wider">
                            COMPUTATION &middot; DOMAIN I-B
                        </span>
                    </div>
                    <h1 className="font-playfair font-bold text-[26px] text-pine-green leading-tight">
                        Let's see how you work with this.
                    </h1>
                </div>

                {/* Step 3: Card 1 (System of Equations) */}
                <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col shadow-sm mb-6">
                    <p className="font-inter text-[15px] text-gray-600 mb-4">
                        Solve the system:
                    </p>

                    <div className="mb-6">
                        <p className="font-inter font-bold text-[20px] text-pine-green tracking-wide">
                            3x &minus; 2y = 12
                        </p>
                        <p className="font-inter font-bold text-[20px] text-pine-green tracking-wide">
                            x + 4y = &minus;2
                        </p>
                    </div>

                    <div className="flex flex-row space-x-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="xInput" className="font-inter font-semibold text-pine-green">x =</label>
                            <input
                                type="text"
                                id="xInput"
                                value={xValue}
                                onChange={(e) => setXValue(e.target.value)}
                                className="w-16 px-3 py-2 rounded-[8px] bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark outline-none font-inter text-center"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="yInput" className="font-inter font-semibold text-pine-green">y =</label>
                            <input
                                type="text"
                                id="yInput"
                                value={yValue}
                                onChange={(e) => setYValue(e.target.value)}
                                className="w-16 px-3 py-2 rounded-[8px] bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark outline-none font-inter text-center"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="graphicalRep" className="font-inter font-semibold text-[14px] text-pine-green">
                            Graphical representation:
                        </label>
                        <select
                            id="graphicalRep"
                            value={graphicalRepresentation}
                            onChange={(e) => setGraphicalRepresentation(e.target.value)}
                            className="w-full px-4 py-3 rounded-[10px] bg-bone-white border border-transparent focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark font-inter text-base outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%230E5546%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                        >
                            <option value="">Select...</option>
                            <option value="intersect">Lines intersect at exactly one point</option>
                            <option value="parallel">Lines are parallel (no solution)</option>
                            <option value="identical">Lines are identical (infinite solutions)</option>
                        </select>
                    </div>
                </div>

                {/* Step 4: Card 2 (Polynomial Factoring) */}
                <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col shadow-sm mb-12">
                    <p className="font-inter text-[15px] text-gray-600 mb-4">
                        Factor completely over the complex numbers:
                    </p>

                    <p className="font-inter font-bold text-[22px] text-pine-green mb-6 text-center">
                        x⁴ &minus; 16
                    </p>

                    <div className="flex flex-col space-y-2">
                        <label className="font-inter font-semibold text-[14px] text-pine-green">
                            Factored Form:
                        </label>
                        <div className="flex w-full">
                            <input
                                type="text"
                                value={factoredForm}
                                onChange={handleFactoredInputChange}
                                className="flex-1 px-4 py-3 rounded-l-[10px] bg-bone-white border border-transparent border-r-gray-200 focus:border-pine-green focus:ring-1 focus:ring-pine-green text-pine-dark outline-none font-inter text-base transition-all"
                                placeholder="Type your factored expression..."
                            />
                            <button
                                type="button"
                                onClick={appendExponent}
                                className="px-4 py-3 rounded-r-[10px] bg-pine-green/10 text-pine-green font-bold text-[18px] hover:bg-pine-green/20 transition-all active:scale-95"
                            >
                                &sup2;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step 5: CTA */}
                <div className="mt-auto pt-10">
                    <Link
                        href={isSubmittable ? "/diagnostic/domain-ib/receptive" : "#"}
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
