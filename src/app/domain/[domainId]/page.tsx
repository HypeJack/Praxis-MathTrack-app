"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

// ── Mock Data Dictionary ──────────────────────────────────────────────
interface Concept {
    id: string;
    title: string;
    status: "Mastered" | "Needs Review" | "Untested";
}

interface DomainData {
    title: string;
    description: string;
    overallReadiness: number;
    concepts: Concept[];
}

const domainMap: Record<string, DomainData> = {
    "number-quantity": {
        title: "Number & Quantity",
        description: "Mastering real numbers, quantities, complex numbers, and matrices.",
        overallReadiness: 0,
        concepts: [
            {
                id: "number-dimensional-analysis",
                title: "Dimensional Analysis",
                status: "Untested",
            },
            {
                id: "number-rational-exponents",
                title: "Rational Exponents",
                status: "Needs Review",
            },
            {
                id: "number-complex",
                title: "Complex Number Operations",
                status: "Untested",
            },
            {
                id: "number-matrices",
                title: "Matrix Multiplication",
                status: "Needs Review",
            },
            {
                id: "number-vectors",
                title: "Vector Addition",
                status: "Untested",
            },
            {
                id: "number-radicals",
                title: "Operating with Radicals",
                status: "Needs Review",
            },
        ],
    },
    "stats-probability": {
        title: "Statistics & Probability",
        description: "Mastering distributions, probability models, and data interpretation.",
        overallReadiness: 0,
        concepts: [
            {
                id: "stats-outliers",
                title: "Measures of Center & Outliers",
                status: "Untested",
            },
            {
                id: "stats-empirical",
                title: "The Empirical Rule",
                status: "Needs Review",
            },
            {
                id: "stats-probability-dependent",
                title: "Conditional Probability",
                status: "Untested",
            },
            {
                id: "stats-expected-value",
                title: "Expected Value",
                status: "Untested",
            },
            {
                id: "stats-bias",
                title: "Sampling & Bias",
                status: "Untested",
            },
            {
                id: "stats-complement",
                title: "Probability of the Complement",
                status: "Untested",
            },
        ],
    },
    "functions-calculus": {
        title: "Functions & Calculus",
        description: "Explore slopes, limits, and the fundamental theorem.",
        overallReadiness: 0,
        concepts: [
            {
                id: "slope",
                title: "Linear Models & Rate of Change",
                status: "Needs Review",
            },
            {
                id: "slope-alt",
                title: "Rate of Change (Advanced)",
                status: "Needs Review",
            },
            {
                id: "functions-transformations",
                title: "Function Transformations",
                status: "Untested",
            },
            {
                id: "functions-composition",
                title: "Evaluating Compositions",
                status: "Untested",
            },
            {
                id: "functions-inverses",
                title: "Inverse Functions",
                status: "Untested",
            },
            {
                id: "functions-exponential",
                title: "Exponential vs. Linear Growth",
                status: "Needs Review",
            },
            {
                id: "functions-logarithms",
                title: "Properties of Logarithms",
                status: "Untested",
            },
            {
                id: "functions-trigonometry",
                title: "Modeling Periodic Phenomena",
                status: "Needs Review",
            },
            {
                id: "functions-domain",
                title: "Domain Restrictions",
                status: "Untested",
            },
            {
                id: "functions-piecewise",
                title: "Piecewise Functions",
                status: "Needs Review",
            },
            {
                id: "functions-rational",
                title: "Rational Functions & Asymptotes",
                status: "Untested",
            },
            {
                id: "functions-sequences",
                title: "Geometric Sequences",
                status: "Needs Review",
            },
            {
                id: "calculus-limits",
                title: "Evaluating Limits",
                status: "Untested",
            },
            {
                id: "calculus-derivatives",
                title: "Derivatives & Tangent Lines",
                status: "Needs Review",
            },
            {
                id: "calculus-integrals",
                title: "Definite Integrals",
                status: "Untested",
            },
            {
                id: "calculus-optimization",
                title: "Optimization (Extrema)",
                status: "Needs Review",
            },
            {
                id: "calculus-implicit",
                title: "Implicit Differentiation",
                status: "Untested",
            },
            {
                id: "calculus-area-curves",
                title: "Area Between Curves",
                status: "Untested",
            },
            {
                id: "functions-step",
                title: "Step Functions",
                status: "Untested",
            },
            {
                id: "functions-symmetry",
                title: "Odd and Even Functions",
                status: "Untested",
            },
        ],
    },
    "geometry": {
        title: "Geometry",
        description: "Master geometric transformations, congruence, similarity, and coordinate geometry.",
        overallReadiness: 40,
        concepts: [
            {
                id: "geometry-similarity",
                title: "Similarity & Area Ratios",
                status: "Untested",
            },
            {
                id: "geometry-trigonometry",
                title: "Right Triangle Trigonometry",
                status: "Untested",
            },
            {
                id: "geometry-circles",
                title: "Arc Length & Sector Area",
                status: "Untested",
            },
            {
                id: "geometry-transformations",
                title: "Rigid Transformations",
                status: "Needs Review",
            },
            {
                id: "geometry-partitioning",
                title: "Partitioning a Line Segment",
                status: "Untested",
            },
            {
                id: "geometry-lines-angles",
                title: "Lines & Angle Relationships",
                status: "Untested",
            },
            {
                id: "geometry-solids",
                title: "Volume & Cross Sections",
                status: "Needs Review",
            },
            {
                id: "geometry-polygons",
                title: "Properties of Parallelograms",
                status: "Untested",
            },
            {
                id: "geometry-proofs",
                title: "Logical Fallacies in Proofs",
                status: "Untested",
            },
            {
                id: "geometry-perimeter-area",
                title: "Area by Decomposition",
                status: "Needs Review",
            }
        ]
    },
    "algebra": {
        title: "Algebra",
        description: "Master systems of equations, polynomials, and expressions.",
        overallReadiness: 0,
        concepts: [
            {
                id: "algebra-systems",
                title: "Systems of Linear Equations",
                status: "Untested",
            },
            {
                id: "algebra-polynomials",
                title: "Zeros of Polynomials",
                status: "Untested",
            },
            {
                id: "algebra-rational-equations",
                title: "Extraneous Solutions",
                status: "Untested",
            },
            {
                id: "algebra-completing-square",
                title: "Completing the Square",
                status: "Needs Review",
            },
            {
                id: "algebra-inequalities",
                title: "Systems of Inequalities",
                status: "Needs Review",
            },
            {
                id: "algebra-complex-roots",
                title: "Complex Solutions",
                status: "Untested",
            },
            {
                id: "algebra-nonlinear-systems",
                title: "Linear & Quadratic Systems",
                status: "Untested",
            },
            {
                id: "algebra-literal-equations",
                title: "Rearranging Formulas",
                status: "Needs Review",
            },
            {
                id: "algebra-average-rate",
                title: "Average Rate of Change",
                status: "Untested",
            },
            {
                id: "algebra-remainder-theorem",
                title: "The Remainder Theorem",
                status: "Untested",
            }
        ]
    }
};

// ── Status Badge ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Concept["status"] }) {
    const base = "px-3 py-1 rounded-full text-[13px] font-semibold tracking-wide whitespace-nowrap";

    if (status === "Mastered") {
        return (
            <span className={`${base} bg-green-100 text-green-800 flex items-center gap-1.5`}>
                <CheckCircle2 size={14} />
                Mastered
            </span>
        );
    }

    if (status === "Needs Review") {
        return (
            <span className={`${base} bg-orange-100 text-orange-800 flex items-center gap-1.5`}>
                <AlertCircle size={14} />
                Needs Review
            </span>
        );
    }

    return (
        <span className={`${base} bg-gray-100 text-gray-600 flex items-center gap-1.5`}>
            <HelpCircle size={14} />
            Untested
        </span>
    );
}

// ── Page Component ────────────────────────────────────────────────────
export default function DomainBridgePage() {
    const params = useParams();
    const router = useRouter();
    const domainId = params.domainId as string;
    const [completedIds, setCompletedIds] = React.useState<string[]>([]);
    const [needsReviewIds, setNeedsReviewIds] = React.useState<string[]>([]);
    
    React.useEffect(() => {
        const completed = localStorage.getItem("mti_completed_lessons");
        if (completed) {
            try {
                setCompletedIds(JSON.parse(completed));
            } catch (e) {
                console.error("Failed to parse mti_completed_lessons", e);
            }
        }

        const needsReview = localStorage.getItem("mti_needs_review_lessons");
        if (needsReview) {
            try {
                setNeedsReviewIds(JSON.parse(needsReview));
            } catch (e) {
                console.error("Failed to parse mti_needs_review_lessons", e);
            }
        }
    }, []);

    const rawDomain = domainMap[domainId];

    // Merge localStorage status
    const domain = React.useMemo(() => {
        if (!rawDomain) return null;
        return {
            ...rawDomain,
            concepts: rawDomain.concepts.map(c => {
                let status = c.status;
                if (completedIds.includes(c.id)) {
                    status = "Mastered" as const;
                }
                // Simulation failure triggers "Needs Review", overriding "Untested" 
                // and potentially "Mastered" if we want to be strict (user said "trigger Needs Review")
                if (needsReviewIds.includes(c.id) && !completedIds.includes(c.id)) {
                    status = "Needs Review" as const;
                }
                // If it was already Mastered but then they failed it in simulation, 
                // we'll keep it as Needs Review to prompt remediation.
                if (needsReviewIds.includes(c.id)) {
                    status = "Needs Review" as const;
                }

                return { ...c, status };
            })
        };
    }, [rawDomain, completedIds, needsReviewIds]);

    // Fallback for unknown domains
    if (!domain) {
        return (
            <div className="min-h-screen bg-bone-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="font-playfair text-[28px] font-bold text-pine-green">
                        Domain Not Found
                    </h1>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-pine-green font-inter font-medium hover:underline"
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bone-white font-inter flex flex-col">
            {/* ── Top Nav ──────────────────────────────────────────── */}
            <header
                className="w-full bg-pine-green flex items-center justify-between px-6 py-4 sticky top-0 z-50 shadow-sm"
                style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
            >
                <Image
                    src="/White MathTrack Institute Logo.png"
                    alt="MathTrack Institute"
                    width={150}
                    height={28}
                    className="h-7 w-auto object-contain"
                    priority
                />
                <Link href="/profile" className="hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-sand-beige border border-bone-white/30 flex items-center justify-center text-pine-dark shadow-sm">
                        <span className="font-bold text-[14px]">JS</span>
                    </div>
                </Link>
            </header>

            {/* ── Domain Header ────────────────────────────────────── */}
            <section className="bg-pine-green text-bone-white px-6 md:px-10 pb-10 pt-6">
                <div className="max-w-[900px] mx-auto w-full">
                    {/* Back Link */}
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-bone-white/70 hover:text-bone-white font-inter text-[14px] font-medium mb-6 transition-colors group"
                    >
                        <ArrowLeft
                            size={16}
                            className="group-hover:-translate-x-0.5 transition-transform"
                        />
                        Back to Dashboard
                    </Link>

                    {/* Title & Description */}
                    <h1 className="font-playfair font-bold text-[32px] leading-tight mb-3">
                        {domain.title}
                    </h1>
                    <p className="font-inter text-[16px] text-bone-white/80 leading-relaxed max-w-[600px] mb-8">
                        {domain.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-inter text-[13px] font-semibold uppercase tracking-wider text-bone-white/60">
                                Overall Readiness
                            </span>
                            <span className="font-inter text-[14px] font-bold text-accent-gold">
                                {domain.overallReadiness}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-bone-white/15 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent-gold rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${domain.overallReadiness}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Concept Roadmap ──────────────────────────────────── */}
            <section className="flex-1 px-6 md:px-10 py-8">
                <div className="max-w-[900px] mx-auto w-full">
                    <h2 className="font-inter font-bold text-[13px] uppercase tracking-wider text-gray-500 mb-5">
                        Concept Roadmap
                    </h2>

                    <div className="space-y-3">
                        {domain.concepts.map((concept) => (
                            <Link
                                key={concept.id}
                                href={`/lesson/${concept.id}`}
                                className="block bg-white border border-gray-200 p-5 rounded-xl flex justify-between items-center hover:shadow-md transition-all cursor-pointer group"
                            >
                                <span className="font-inter font-semibold text-[18px] text-pine-green group-hover:text-pine-dark transition-colors">
                                    {concept.title}
                                </span>
                                <StatusBadge status={concept.status} />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
