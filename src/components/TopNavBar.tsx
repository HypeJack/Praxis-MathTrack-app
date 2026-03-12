"use client";

import React from "react";
import Image from "next/image";
import { Flame } from "lucide-react";

interface TopNavBarProps {
    title?: string;
    xp?: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
    title = "Screen Title",
    xp = 1250
}) => {
    return (
        <nav className="w-full bg-pine-green flex items-center justify-between px-4 sticky top-0 z-50 transition-all duration-300"
            style={{
                height: "calc(56px + env(safe-area-inset-top))",
                paddingTop: "env(safe-area-inset-top)"
            }}>
            {/* Left Element: Logo Image */}
            <div className="flex items-center gap-2">
                <Image
                    src="/White MathTrack Institute Logo.png"
                    alt="MathTrack Institute"
                    width={150}
                    height={28}
                    className="h-7 w-auto object-contain"
                    priority
                />
            </div>

            {/* Center Element: Screen Title (16px, Bone White) */}
            <div className="absolute left-1/2 -translate-x-1/2 text-center w-full max-w-[120px] truncate pointer-events-none">
                <h2 className="font-inter font-semibold text-[16px] text-bone-white">
                    {title}
                </h2>
            </div>

            {/* Right Element: XP Counter (16px, Gold) */}
            <div className="flex items-center gap-1.5 bg-pine-dark/20 px-3 py-1 rounded-full border border-bone-white/10">
                <Flame className="w-4 h-4 text-accent-gold fill-accent-gold" />
                <span className="font-inter font-bold text-[16px] text-accent-gold">
                    {xp.toLocaleString()}
                </span>
            </div>
        </nav>
    );
};
