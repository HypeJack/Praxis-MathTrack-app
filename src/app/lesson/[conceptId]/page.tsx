"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const ratingLabels: Record<number, string> = {
    1: "I have little to no familiarity",
    2: "I've encountered this but feel uncertain",
    3: "I have a working understanding",
    4: "I feel confident with this topic",
    5: "I know this deeply and could teach it",
};

export default function SlopeArtifactEntry() {
    const params = useParams();
    const conceptId = params.conceptId as string;
    const [rating, setRating] = useState<number | null>(null);
    const router = useRouter();

    const handleRatingSelect = (val: number) => {
        setRating(val);
    };

    const handleBeginJourney = () => {
        if (!rating) return;

        if (rating === 1 || rating === 2) {
            router.push(`/lesson/${conceptId}/concept`);
        } else if (rating === 3) {
            router.push(`/lesson/${conceptId}/computation`);
        } else if (rating === 4 || rating === 5) {
            router.push(`/lesson/${conceptId}/literacy-b`);
        }
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col p-6 md:p-10 relative">

            {/* Header Content */}
            <div className="mb-10 text-center max-w-[500px] mx-auto mt-4 md:mt-10">
                <p className="font-inter font-medium text-[18px] text-pine-dark">
                    Before we begin, tell us where you are with this topic.
                </p>
            </div>

            {/* Rating UI */}
            <div className="flex flex-col items-center flex-1 justify-center max-w-[500px] mx-auto w-full">
                <div className="flex justify-between w-full max-w-[360px] mb-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleRatingSelect(num)}
                            className={`w-[52px] h-[52px] rounded-full flex items-center justify-center font-inter font-bold text-[22px] transition-all duration-200 active:scale-95 shadow-sm
                  ${rating === num
                                    ? "bg-accent-gold text-white ring-2 ring-accent-gold ring-offset-2"
                                    : "bg-white border border-gray-300 text-pine-dark hover:border-accent-gold/50"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {/* Explicit Confidence Anchors */}
                <div className="flex justify-between w-full max-w-[360px] px-2 mb-4">
                    <span className="font-inter text-[14px] text-gray-400">Not sure</span>
                    <span className="font-inter text-[14px] text-gray-400">Fully confident</span>
                </div>

                {/* Selected Rating Description */}
                <div className="min-h-[60px] w-full flex items-center justify-center mb-8">
                    {rating ? (
                        <div className="w-full bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 animate-in fade-in zoom-in-95 duration-200 mx-auto">
                            <p className="text-center font-inter font-semibold text-[15px] md:text-[16px] text-accent-gold">
                                {rating} &mdash; {ratingLabels[rating]}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 font-inter text-[15px] italic">
                            Select a number to continue.
                        </p>
                    )}
                </div>

                {/* CTA Button */}
                <div className="w-full mt-auto sm:mt-8 pt-6 pb-2">
                    <button
                        onClick={handleBeginJourney}
                        disabled={!rating}
                        className={`w-full bg-pine-dark rounded-[12px] py-4 px-6 flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-sm transition-all duration-200 gap-2 ${rating
                            ? "opacity-100 active:scale-[0.98] hover:bg-pine-dark/90 hover:shadow-md cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        Begin Journey
                        <ArrowRight size={20} className={rating ? "animate-pulse" : ""} />
                    </button>
                </div>
            </div>

        </div>
    );
}
