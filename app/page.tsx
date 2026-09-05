import TerminalBoot from "@/components/TerminalBoot";
import ProblemSection from "@/components/ProblemSection";
import LiveDemoSection from "@/components/LiveDemoSection";
import ProjectsDoor from "@/components/ProjectsDoor";
import MetricsSection from "@/components/MetricsSection";
import HackathonWall from "@/components/HackathonWall";
import ClosingSection from "@/components/ClosingSection";
import AskAsadBike from "@/components/AskAsadBike";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Ambient background glow — single orchestrated ambient layer, not scattered per-section effects */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 45% at 20% 15%, rgba(200,30,58,0.16), transparent 60%), radial-gradient(50% 40% at 85% 70%, rgba(212,175,55,0.10), transparent 60%)",
        }}
      />

      <section className="flex min-h-screen flex-col items-start justify-center px-6 py-24 sm:px-12 md:px-20">
        <TerminalBoot />
      </section>

      <ProblemSection />

      <LiveDemoSection />

      <ProjectsDoor />

      <MetricsSection />

      <HackathonWall />

      <ClosingSection />

      <AskAsadBike />
    </main>
  );
}
