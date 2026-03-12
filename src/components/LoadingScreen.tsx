"use client";

import { motion } from "framer-motion";

export function LoadingScreen({ message = "Calculating your profile..." }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-bone-white z-[100] flex flex-col items-center justify-center p-6">
            <motion.div 
                className="w-16 h-16 border-4 border-pine-green/20 border-t-pine-green rounded-full mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-inter font-medium text-pine-dark text-lg"
            >
                {message}
            </motion.p>
        </div>
    );
}
