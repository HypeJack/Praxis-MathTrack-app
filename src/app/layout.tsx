import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["400", "600", "700"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["700"],
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
    title: "MathTrack Praxis App",
    description: "Praxis 5165 preparation app. High-efficiency math training.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} antialiased bg-canvas text-text-main min-h-screen flex justify-center`}>
                {children}
            </body>
        </html>
    );
}
