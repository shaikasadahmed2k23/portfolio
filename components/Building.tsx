"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/projects";

const FLOOR_H = 22; // px height of each slab in the building visual
const FLOOR_GAP = 3;

type Beam = { top: number; left: number; width: number } | null;

export default function Building({
  onSelectProject,
  onExit,
}: {
  onSelectProject: (project: Project) => void;
  onExit: () => void;
}) {
  // Single source of truth: every synced part (right-side slab highlight,
  // beam origin, center floor label/content) reads from this one value.
  const [activeFloor, setActiveFloor] = useState(PROJECTS[0].floor);
  const [beam, setBeam] = useState<Beam>(null);

  const floorRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const panelRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const slabRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const floor = Number(entry.target.getAttribute("data-floor"));
            if (floor) setActiveFloor(floor);
          }
        });
      },
      { threshold: 0.6 }
    );
    Object.values(floorRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Recompute the beam whenever the active floor changes (or on resize) —
  // it reads live DOM positions of the right-side slab and the center panel,
  // so it always originates from the exact selected floor.
  const computeBeam = useCallback(() => {
    const slabEl = slabRefs.current[activeFloor];
    const panelEl = panelRefs.current[activeFloor];
    if (!slabEl || !panelEl || window.innerWidth < 640) {
      setBeam(null);
      return;
    }
    const slabRect = slabEl.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();
    const top = slabRect.top + slabRect.height / 2;
    const left = panelRect.right;
    const width = Math.max(slabRect.left - panelRect.right, 0);
    setBeam({ top, left, width });
  }, [activeFloor]);

  useEffect(() => {
    computeBeam();
    window.addEventListener("resize", computeBeam);
    return () => window.removeEventListener("resize", computeBeam);
  }, [computeBeam]);

  const scrollToFloor = (floor: number) => {
    floorRefs.current[floor]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const towerHeight = PROJECTS.length * (FLOOR_H + FLOOR_GAP);

  return (
    <div id="building" className="relative">
      {/* Floor number indicator — reads activeFloor */}
      <div className="fixed left-6 top-6 z-20 font-[family-name:var(--font-data)] text-xs text-ink-faint sm:left-10">
        FLOOR <span className="text-brass">{String(activeFloor).padStart(2, "0")}</span> / 15
      </div>

      {/* Leave the building — always reachable */}
      <button
        type="button"
        onClick={onExit}
        className="fixed left-6 top-14 z-20 font-[family-name:var(--font-data)] text-xs text-ink-faint transition-colors hover:text-brass sm:left-10"
      >
        ← close door
      </button>

      {/* Light beam: originates from the active floor's slab, travels to the center panel */}
      {beam && (
        <motion.div
          key={activeFloor}
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: beam.top - 1,
            left: beam.left,
            width: beam.width,
            transformOrigin: "right center",
          }}
          className="pointer-events-none z-10 hidden sm:block"
        >
          <div
            className="h-[2px] w-full bg-gradient-to-l from-brass via-brass/50 to-transparent"
            style={{
              boxShadow:
                "0 0 10px 2px var(--color-brass), 0 0 26px 6px rgba(212,175,55,0.22)",
            }}
          />
        </motion.div>
      )}

      {/* Real building elevation: floors stacked one on top of another */}
      <nav
        aria-label="Building floors"
        className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center sm:flex"
      >
        {/* rooftop cap */}
        <div className="h-2 w-14 rounded-t-sm bg-surface-2" />
        <div className="flex flex-col-reverse gap-[3px] border-x border-[var(--glass-border)] bg-surface/60 px-1.5 py-1.5 backdrop-blur">
          {[...PROJECTS].reverse().map((p) => (
            <button
              key={p.floor}
              type="button"
              ref={(el) => {
                slabRefs.current[p.floor] = el;
              }}
              onClick={() => scrollToFloor(p.floor)}
              aria-label={`Go to floor ${p.floor}: ${p.name}`}
              aria-current={activeFloor === p.floor}
              className="group relative flex items-center"
              style={{ height: FLOOR_H }}
            >
              <span
                className={`block w-11 rounded-[2px] border transition-all ${
                  activeFloor === p.floor
                    ? "border-brass bg-brass/25 shadow-[0_0_10px_var(--color-brass)]"
                    : "border-[var(--glass-border)] bg-ink/5 group-hover:border-ink-dim"
                }`}
                style={{ height: FLOOR_H - 6 }}
              />
              <span
                className={`pointer-events-none absolute right-14 whitespace-nowrap rounded bg-surface px-2 py-1 font-[family-name:var(--font-data)] text-[11px] transition-opacity ${
                  activeFloor === p.floor
                    ? "text-brass opacity-100"
                    : "text-ink-dim opacity-0 group-hover:opacity-100"
                }`}
              >
                {String(p.floor).padStart(2, "0")} · {p.name}
              </span>
            </button>
          ))}
        </div>
        {/* ground base */}
        <div className="h-2 w-20 rounded-b-sm bg-surface-2" style={{ marginTop: -1 }} />
        <div className="mt-2 font-[family-name:var(--font-data)] text-[10px] text-ink-faint">
          {towerHeight > 0 ? "15 floors" : ""}
        </div>
      </nav>

      <div ref={containerRef} className="flex flex-col items-center">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            ref={(el) => {
              floorRefs.current[project.floor] = el;
            }}
            data-floor={project.floor}
            className="flex min-h-screen w-full items-center justify-center px-6 sm:px-12 md:px-20"
          >
            <div className="relative w-full max-w-3xl">
              {/* Wall recede either side — architectural depth cue */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-6 -left-10 -right-10 -z-10 hidden sm:block"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.05) 12%, transparent 24%, transparent 76%, rgba(212,175,55,0.05) 88%, transparent 100%)",
                }}
              />

              <button
                type="button"
                ref={(el) => {
                  panelRefs.current[project.floor] = el;
                }}
                onClick={() => onSelectProject(project)}
                className="group relative w-full overflow-hidden rounded-sm text-left"
              >
                {/* Ceiling edge */}
                <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-brass to-transparent opacity-70" />

                <div
                  className="relative px-8 py-12 sm:px-12"
                  style={{
                    backgroundImage:
                      "radial-gradient(120% 100% at 100% 50%, rgba(212,175,55,0.05), transparent 55%), repeating-linear-gradient(90deg, rgba(237,231,227,0.035) 0 1px, transparent 1px 64px)",
                  }}
                >
                  {/* Warm glow landing where the beam arrives from the right */}
                  {activeFloor === project.floor && (
                    <motion.div
                      aria-hidden
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="pointer-events-none absolute inset-y-0 right-0 w-24"
                      style={{
                        background:
                          "radial-gradient(60% 100% at 100% 50%, rgba(212,175,55,0.16), transparent 70%)",
                      }}
                    />
                  )}

                  {/* facade window strip */}
                  <div className="relative mb-6 flex gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-2 w-6 rounded-[1px] bg-brass/20 transition-colors group-hover:bg-brass/50"
                      />
                    ))}
                  </div>

                  <span className="relative font-[family-name:var(--font-data)] text-xs text-brass">
                    FLOOR {String(project.floor).padStart(2, "0")}
                  </span>
                  <motion.h3
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative mt-2 font-[family-name:var(--font-display)] text-4xl text-ink sm:text-5xl md:text-6xl"
                  >
                    {project.name}
                  </motion.h3>
                  <p className="relative mt-3 max-w-md text-base text-ink-dim">
                    {project.tagline}
                  </p>
                  <span className="relative mt-6 inline-block font-[family-name:var(--font-data)] text-xs text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">
                    enter floor →
                  </span>
                </div>

                {/* Floor edge */}
                <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-brass to-transparent opacity-70" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
