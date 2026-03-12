import Image from "next/image";
import Link from "next/link";

const PARTICLES = [
  { left: "left-[5%]", size: "w-[30px] h-[30px]", duration: "[animation-duration:18s]", delay: "[animation-delay:2s]" },
  { left: "left-[15%]", size: "w-[45px] h-[45px]", duration: "[animation-duration:22s]", delay: "[animation-delay:5s]" },
  { left: "left-[25%]", size: "w-[25px] h-[25px]", duration: "[animation-duration:16s]", delay: "[animation-delay:1s]" },
  { left: "left-[35%]", size: "w-[55px] h-[55px]", duration: "[animation-duration:25s]", delay: "[animation-delay:7s]" },
  { left: "left-[45%]", size: "w-[35px] h-[35px]", duration: "[animation-duration:19s]", delay: "[animation-delay:4s]" },
  { left: "left-[55%]", size: "w-[40px] h-[40px]", duration: "[animation-duration:21s]", delay: "[animation-delay:8s]" },
  { left: "left-[65%]", size: "w-[28px] h-[28px]", duration: "[animation-duration:17s]", delay: "[animation-delay:3s]" },
  { left: "left-[75%]", size: "w-[50px] h-[50px]", duration: "[animation-duration:24s]", delay: "[animation-delay:6s]" },
  { left: "left-[85%]", size: "w-[32px] h-[32px]", duration: "[animation-duration:20s]", delay: "[animation-delay:9s]" },
  { left: "left-[95%]", size: "w-[48px] h-[48px]", duration: "[animation-duration:23s]", delay: "[animation-delay:1.5s]" },
  { left: "left-[20%]", size: "w-[38px] h-[38px]", duration: "[animation-duration:18.5s]", delay: "[animation-delay:4.5s]" },
  { left: "left-[80%]", size: "w-[42px] h-[42px]", duration: "[animation-duration:21.5s]", delay: "[animation-delay:7.5s]" },
];

export default function WelcomePage() {
  return (
    <main className="relative min-h-[100dvh] w-full bg-pine-green overflow-hidden flex flex-col items-center justify-between font-inter text-bone-white">
      {/* Decorative Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className={`absolute bottom-[-10%] opacity-0 animate-[float-up_linear_infinite] bg-white/10 [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)] ${p.left} ${p.size} ${p.duration} ${p.delay}`}
          />
        ))}
      </div>

      {/* Main Content (Upper 55% focus) */}
      <div className="flex-1 w-full flex flex-col items-center justify-start pt-[20dvh] px-8 text-center relative z-10">
        {/* Title Logo Only */}
        <Image
          src="/White MathTrack Institute Logo.png"
          alt="MathTrack Institute"
          width={320}
          height={60}
          className="mx-auto opacity-0 animate-[fade-in_600ms_ease-out_forwards] [animation-delay:300ms]"
          priority
        />

        {/* Subhead */}
        <p className="font-playfair italic text-[20px] text-accent-green opacity-0 animate-[fade-in_600ms_ease-out_forwards] [animation-delay:500ms] mt-4">
          Your Praxis 5165 journey starts here.
        </p>
      </div>

      {/* CTAs (Bottom aligned) */}
      <div className="p-8 pb-12 w-full max-w-[480px] mx-auto relative z-10">
        <div className="space-y-6 flex flex-col">
          <Link
            href="/onboarding"
            className="block w-full bg-accent-green hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 rounded-[12px] py-4 px-6 text-center text-white font-inter font-bold text-[18px]"
          >
            Begin Your Journey
          </Link>

          <Link
            href="/login"
            className="block text-center text-accent-green font-inter font-semibold text-[16px] hover:opacity-80 transition-opacity"
          >
            Already have an account? Sign in &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
