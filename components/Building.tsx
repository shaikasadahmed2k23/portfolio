"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/projects";

// TEMP: testing with a handful of floors first, per Asad's request — bump
// this back up toward PROJECTS.length once the building/beam feel right.
const VISIBLE_COUNT = 4;
const VISIBLE_PROJECTS = PROJECTS.slice(-VISIBLE_COUNT);

const FLOOR_H = 22; // px height of each slab in the RIGHT mini building
const CENTER_FLOOR_H = 60; // px height of a collapsed row in the CENTER building

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
  // Single source of truth: every synced part (right mini-building highlight,
  // beam, center building's open floor) reads from this one value.
  const [activeFloor, setActiveFloor] = useState(VISIBLE_PROJECTS[0].floor);
  const [beam, setBeam] = useState<Beam>(null);

  const floorRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const slabRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const centerRowRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const centerWindowRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [highlightTop, setHighlightTop] = useState(0);
  // Whether we've actually scrolled into the building yet. The fixed nav,
  // center building, and beam should only exist once the person has
  // scrolled past the door — otherwise they sit on top of the door/hero
  // content when scrolled all the way back up.
  const [showChrome, setShowChrome] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowChrome(entry.boundingClientRect.top <= 0),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Scroll-snap makes the flow read as floor-by-floor (like riding an
  // elevator) instead of free-scrolling through arbitrary positions.
  // Scoped to the viewport only while the building is open, restored on exit.
  useEffect(() => {
    const html = document.documentElement;
    const prevSnap = html.style.scrollSnapType;
    html.style.scrollSnapType = "y mandatory";
    return () => {
      html.style.scrollSnapType = prevSnap;
    };
  }, []);

  // Centerline detection: fires the moment a floor's section crosses the
  // middle band of the viewport, regardless of scroll speed — reliable
  // during fast/continuous scroll, unlike a ratio threshold.
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
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    Object.values(floorRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Slide the right mini-building's highlight smoothly between floors.
  useEffect(() => {
    const el = slabRefs.current[activeFloor];
    if (el) setHighlightTop(el.offsetTop);
  }, [activeFloor]);

  // Beam: apex is the lit window on the RIGHT mini-building (the source).
  // Base is the lit window on the CENTER building (the destination). Both
  // ends are now fixed-position elements — neither moves as the page
  // scrolls — so the beam only needs to be recomputed when the active
  // floor changes or the viewport resizes. This is what fixes the beam
  // "breaking"/disconnecting mid-scroll: previously its destination was a
  // scrolling card whose position kept moving after the beam had already
  // been drawn.
  const computeBeam = useCallback(() => {
    const slabEl = slabRefs.current[activeFloor];
    const centerEl = centerWindowRefs.current[activeFloor];
    if (!slabEl || !centerEl || window.innerWidth < 640) {
      setBeam(null);
      return;
    }
    const slabRect = slabEl.getBoundingClientRect();
    const centerRect = centerEl.getBoundingClientRect();

    const apexX = slabRect.left;
    const apexY = slabRect.top + slabRect.height / 2;

    const baseX = centerRect.right;
    const baseCenterY = centerRect.top + centerRect.height / 2;
    const baseHalfHeight = 42;

    if (apexX <= baseX) {
      setBeam(null);
      return;
    }

    setBeam({
      apexX,
      apexY,
      baseX,
      baseTop: baseCenterY - baseHalfHeight,
      baseBottom: baseCenterY + baseHalfHeight,
    });
  }, [activeFloor]);

  useEffect(() => {
    computeBeam();
    window.addEventListener("resize", computeBeam);
    return () => window.removeEventListener("resize", computeBeam);
  }, [computeBeam]);

  // Re-settle the beam once the active row's "open" animation (its height
  // growing to show the project text) finishes, so it lands exactly on the
  // final window position rather than where the row started.
  const handleRowLayoutComplete = () => computeBeam();

  const scrollToFloor = (floor: number) => {
    floorRefs.current[floor]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div id="building" className="relative">
      {/* Floor number indicator — reads activeFloor */}
      <div className="fixed left-6 top-6 z-20 font-[family-name:var(--font-data)] text-xs text-ink-faint sm:left-10">
        FLOOR <span className="text-brass">{String(activeFloor).padStart(2, "0")}</span> /{" "}
        {VISIBLE_PROJECTS.length}
      </div>

      {/* Leave the building — always reachable */}
      <button
        type="button"
        onClick={onExit}
        className="fixed left-6 top-14 z-20 font-[family-name:var(--font-data)] text-xs text-ink-faint transition-colors hover:text-brass sm:left-10"
      >
        ← close door
      </button>

      {/* Light beam: a V-shaped cone from the RIGHT mini-building's lit
          window to the CENTER building's lit window. Never a straight
          line, never sourced from the center. */}
      {beam && showChrome && (
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
              <stop offset="100%" stopColor="var(--color-brass)" stopOpacity="0.08" />
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
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ transformOrigin: `${beam.apexX}px ${beam.apexY}px` }}
            points={`${beam.apexX},${beam.apexY} ${beam.baseX},${beam.baseTop} ${beam.baseX},${beam.baseBottom}`}
            fill="url(#beamFill)"
            filter="url(#beamGlow)"
          />

          <motion.line
            key={`core-${activeFloor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
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

      {/* RIGHT mini-building: the light SOURCE. A compact elevation —
          roof, recessed facade walls, a real window pair per floor, base. */}
      <nav
        aria-label="Building floors"
        className={`fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center transition-opacity duration-300 sm:flex ${
          showChrome ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="relative h-3 w-16">
          <div
            className="absolute inset-x-1 bottom-0 h-3 bg-surface-2"
            style={{ clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }}
          />
        </div>
        <div className="h-1 w-[72px] bg-surface-2" />

        <div
          className="relative flex w-[72px] flex-col-reverse border-x border-[var(--glass-border)] bg-gradient-to-b from-surface/70 via-surface/55 to-surface-2/70 backdrop-blur"
          style={{
            boxShadow:
              "inset 6px 0 10px -6px rgba(0,0,0,0.55), inset -6px 0 10px -6px rgba(0,0,0,0.35)",
          }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 z-10"
            style={{ height: FLOOR_H }}
            animate={{ top: highlightTop }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div
              className="mx-auto h-full w-[64px] rounded-[2px] bg-brass/10"
              style={{ boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.55)" }}
            />
          </motion.div>

          {[...VISIBLE_PROJECTS].reverse().map((p) => {
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

        <div className="h-2 w-20 rounded-b-sm bg-surface-2" style={{ marginTop: -1 }} />
      </nav>

      {/* CENTER building: the light's DESTINATION, and the same building
          structure the right one is a miniature of — fixed on screen (it
          doesn't scroll away), roof + facade + windowed floors + base. The
          active floor opens up to show FLOOR / name / tagline; every other
          floor stays a plain lit-or-dim window row, exactly like the mini
          one. Click the open floor to enter it; click any other to scroll
          to it. */}
      <div
        className={`fixed left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-opacity duration-300 sm:flex ${
          showChrome ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={
          {
            "--bw": "clamp(320px, 46vw, 640px)",
            "--bh": "clamp(560px, 88vh, 940px)",
            height: "var(--bh)",
          } as CSSProperties
        }
      >
        <div className="relative h-8 w-[calc(var(--bw)*0.833)]">
          <div
            className="absolute inset-x-3 bottom-0 h-8 bg-surface-2"
            style={{ clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }}
          />
        </div>
        <div className="h-1.5 w-[var(--bw)] bg-surface-2" />

        <div
          className="relative flex w-[var(--bw)] min-h-0 flex-1 flex-col-reverse border-x border-[var(--glass-border)] bg-gradient-to-b from-surface/85 via-surface/65 to-surface-2/85 shadow-2xl backdrop-blur"
          style={{
            boxShadow:
              "inset 10px 0 18px -10px rgba(0,0,0,0.6), inset -10px 0 18px -10px rgba(0,0,0,0.4), 0 30px 80px -20px rgba(0,0,0,0.7)",
          }}
        >
          {[...VISIBLE_PROJECTS].reverse().map((project) => {
            const isActive = activeFloor === project.floor;
            return (
              <motion.div
                key={project.floor}
                ref={(el) => {
                  centerRowRefs.current[project.floor] = el;
                }}
                layout
                onLayoutAnimationComplete={handleRowLayoutComplete}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex-1 border-t border-[var(--glass-border)]/50 first:border-t-0"
              >
                <button
                  type="button"
                  onClick={() => (isActive ? onSelectProject(project) : scrollToFloor(project.floor))}
                  aria-label={
                    isActive ? `Open ${project.name} case study` : `Go to floor ${project.floor}: ${project.name}`
                  }
                  aria-current={isActive}
                  className="group flex h-full w-full flex-col justify-center gap-3 px-5 py-3 text-left"
                  style={{ minHeight: CENTER_FLOOR_H }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      ref={(el) => {
                        centerWindowRefs.current[project.floor] = el;
                      }}
                      className="flex gap-1"
                    >
                      {[0, 1].map((w) => (
                        <span
                          key={w}
                          className={`block h-6 w-4 rounded-[2px] border transition-all duration-500 ${
                            isActive
                              ? "border-brass bg-brass shadow-[0_0_14px_3px_var(--color-brass),0_0_28px_7px_rgba(212,175,55,0.35)]"
                              : "border-[var(--glass-border)] bg-ink/10 group-hover:border-ink-dim group-hover:bg-ink/20"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`font-[family-name:var(--font-data)] text-xs transition-colors ${
                        isActive ? "text-brass" : "text-ink-faint group-hover:text-ink-dim"
                      }`}
                    >
                      FLOOR {String(project.floor).padStart(2, "0")}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <h3 className="font-[family-name:var(--font-display)] text-2xl text-ink sm:text-3xl">
                          {project.name}
                        </h3>
                        <p className="mt-1 max-w-[20rem] text-sm text-ink-dim">{project.tagline}</p>
                        <span className="mt-3 inline-block font-[family-name:var(--font-data)] text-[11px] text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">
                          enter floor →
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>

        <div
          className="h-2.5 w-[calc(var(--bw)*1.125)] rounded-b-sm bg-surface-2"
          style={{ marginTop: -1 }}
        />
      </div>

      {/* Invisible per-floor scroll sections — drive scroll-snap + the
          IntersectionObserver above. No visible card here anymore: all
          project content now lives inside the fixed center building above,
          so the beam has a stable, non-scrolling destination. */}
      <div ref={containerRef} className="flex flex-col items-center">
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
        {VISIBLE_PROJECTS.map((project) => (
          <div
            key={project.id}
            ref={(el) => {
              floorRefs.current[project.floor] = el;
            }}
            data-floor={project.floor}
            style={{ scrollSnapAlign: "center" }}
            className="pointer-events-none flex min-h-screen w-full items-center justify-center"
          >
            <span
              aria-hidden
              className="select-none font-[family-name:var(--font-display)] text-[18vw] leading-none text-ink/[0.03]"
            >
              {String(project.floor).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
