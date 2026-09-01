"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/projects";

const FLOOR_H = 22; // px height of each slab in the building visual
const FLOOR_GAP = 3;

type Beam = {
  apexX: number;
  apexY: number;
  baseX: number;
  baseTop: number;
  baseBottom: number;
} | null;

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
  // it reads live DOM positions of the right-side mini-building floor
  // (the source) and the center panel (the destination), so the V always
  // originates exactly from the selected floor's lit window and widens as
  // it travels left toward the center project.
  const computeBeam = useCallback(() => {
    const slabEl = slabRefs.current[activeFloor];
    const panelEl = panelRefs.current[activeFloor];
    if (!slabEl || !panelEl || window.innerWidth < 640) {
      setBeam(null);
      return;
    }
    const slabRect = slabEl.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();

    // Apex: the exact lit window on the right mini-building — its left
    // edge (the side facing the center), vertically centered on the floor.
    const apexX = slabRect.left;
    const apexY = slabRect.top + slabRect.height / 2;

    // Base: the right edge of the center panel, spread into a cone that's
    // a fraction of the panel's height so it visibly "widens toward the
    // center" without swallowing the whole card.
    const baseX = panelRect.right;
    const panelCenterY = panelRect.top + panelRect.height / 2;
    const baseHalfHeight = Math.max(panelRect.height * 0.32, 46);

    if (apexX <= baseX) {
      setBeam(null);
      return;
    }

    setBeam({
      apexX,
      apexY,
      baseX,
      baseTop: panelCenterY - baseHalfHeight,
      baseBottom: panelCenterY + baseHalfHeight,
    });
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

      {/* Light beam: a V-shaped cone that ORIGINATES at the selected floor's
          lit window on the right mini-building and WIDENS as it travels
          right -> left, terminating on the center project. Never a straight
          horizontal line, and never sourced from the center. */}
      {beam && (
        <svg
          aria-hidden
          className="pointer-events-none fixed inset-0 z-10 hidden h-full w-full sm:block"
        >
          <defs>
            <linearGradient
              id="beamFill"
              gradientUnits="userSpaceOnUse"
              x1={beam.apexX}
              y1={beam.apexY}
              x2={beam.baseX}
              y2={beam.apexY}
            >
              <stop offset="0%" stopColor="var(--color-brass)" stopOpacity="0.85" />
              <stop offset="55%" stopColor="var(--color-brass)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-brass)" stopOpacity="0.04" />
            </linearGradient>
            <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.polygon
            key={activeFloor}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: `${beam.apexX}px ${beam.apexY}px` }}
            points={`${beam.apexX},${beam.apexY} ${beam.baseX},${beam.baseTop} ${beam.baseX},${beam.baseBottom}`}
            fill="url(#beamFill)"
            filter="url(#beamGlow)"
          />

          {/* Bright core spine down the middle of the cone, and a spark at the source */}
          <motion.line
            key={`core-${activeFloor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            x1={beam.apexX}
            y1={beam.apexY}
            x2={beam.baseX}
            y2={(beam.baseTop + beam.baseBottom) / 2}
            stroke="var(--color-brass)"
            strokeWidth={1.5}
            strokeOpacity={0.6}
          />
          <motion.circle
            key={`spark-${activeFloor}`}
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: 1, r: 3.5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            cx={beam.apexX}
            cy={beam.apexY}
            fill="var(--color-brass)"
            filter="url(#beamGlow)"
          />
        </svg>
      )}

      {/* Right mini-building: the light SOURCE. Built to read as an actual
          miniature elevation — roof cap, receding side walls for depth,
          a facade with a real window pair per floor, and a ground base.
          The active floor's window is the only one lit; that lit window is
          exactly where the beam's apex is computed from above. */}
      <nav
        aria-label="Building floors"
        className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center sm:flex"
      >
        {/* roof: peaked cap + parapet line for a real rooftop silhouette */}
        <div className="relative h-3 w-16">
          <div
            className="absolute inset-x-1 bottom-0 h-3 bg-surface-2"
            style={{ clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }}
          />
        </div>
        <div className="h-1 w-[72px] bg-surface-2" />

        {/* facade: side walls give it depth via inset shading; floors are
            separated by real divider lines rather than just gaps */}
        <div
          className="relative flex w-[72px] flex-col-reverse border-x border-[var(--glass-border)] bg-gradient-to-b from-surface/70 via-surface/55 to-surface-2/70 backdrop-blur"
          style={{
            boxShadow:
              "inset 6px 0 10px -6px rgba(0,0,0,0.55), inset -6px 0 10px -6px rgba(0,0,0,0.35)",
          }}
        >
          {[...PROJECTS].reverse().map((p) => {
            const isActive = activeFloor === p.floor;
            return (
              <button
                key={p.floor}
                type="button"
                ref={(el) => {
                  slabRefs.current[p.floor] = el;
                }}
                onClick={() => scrollToFloor(p.floor)}
                aria-label={`Go to floor ${p.floor}: ${p.name}`}
                aria-current={isActive}
                className="group relative flex items-center justify-center gap-[3px] border-t border-[var(--glass-border)]/60 px-2 first:border-t-0"
                style={{ height: FLOOR_H }}
              >
                {/* two facade windows per floor — the selected floor's
                    windows are the lit source the V-beam originates from */}
                {[0, 1].map((w) => (
                  <span
                    key={w}
                    className={`block w-5 rounded-[1px] border transition-all duration-300 ${
                      isActive
                        ? "border-brass bg-brass shadow-[0_0_9px_2px_var(--color-brass),0_0_18px_4px_rgba(212,175,55,0.35)]"
                        : "border-[var(--glass-border)] bg-ink/10 group-hover:border-ink-dim group-hover:bg-ink/20"
                    }`}
                    style={{ height: FLOOR_H - 10 }}
                  />
                ))}

                <span
                  className={`pointer-events-none absolute right-[88px] whitespace-nowrap rounded bg-surface px-2 py-1 font-[family-name:var(--font-data)] text-[11px] transition-opacity ${
                    isActive
                      ? "text-brass opacity-100"
                      : "text-ink-dim opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {String(p.floor).padStart(2, "0")} · {p.name}
                </span>
              </button>
            );
          })}
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
