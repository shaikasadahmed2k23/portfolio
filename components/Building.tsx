"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/projects";

const FLOOR_H = 22; // px height of each slab in the building visual
const FLOOR_GAP = 3;

export default function Building({
  onSelectProject,
  onExit,
}: {
  onSelectProject: (project: Project) => void;
  onExit: () => void;
}) {
  const [activeFloor, setActiveFloor] = useState(PROJECTS[0].floor);
  const floorRefs = useRef<Record<number, HTMLDivElement | null>>({});
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

  const scrollToFloor = (floor: number) => {
    floorRefs.current[floor]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const towerHeight = PROJECTS.length * (FLOOR_H + FLOOR_GAP);

  return (
    <div id="building" className="relative">
      {/* Floor number indicator */}
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

      <div ref={containerRef} className="flex flex-col">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            ref={(el) => {
              floorRefs.current[project.floor] = el;
            }}
            data-floor={project.floor}
            className="flex min-h-screen w-full items-center border-t border-[var(--glass-border)] px-6 sm:px-12 md:px-20"
          >
            <button
              type="button"
              onClick={() => onSelectProject(project)}
              className="group flex w-full max-w-3xl flex-col items-start gap-2 text-left"
            >
              <span className="font-[family-name:var(--font-data)] text-xs text-brass">
                FLOOR {String(project.floor).padStart(2, "0")}
              </span>
              <motion.span
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="font-[family-name:var(--font-display)] text-4xl text-ink sm:text-5xl md:text-6xl"
              >
                {project.name}
              </motion.span>
              <span className="text-base text-ink-dim">{project.tagline}</span>
              <span className="mt-3 font-[family-name:var(--font-data)] text-xs text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">
                enter floor →
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
