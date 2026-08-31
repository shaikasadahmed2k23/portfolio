"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/projects";

export default function Building({
  onSelectProject,
}: {
  onSelectProject: (project: Project) => void;
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

  return (
    <div id="building" className="relative">
      {/* Floor number indicator */}
      <div className="fixed left-6 top-6 z-20 font-[family-name:var(--font-data)] text-xs text-ink-faint sm:left-10">
        FLOOR <span className="text-brass">{String(activeFloor).padStart(2, "0")}</span> / 15
      </div>

      {/* Fixed brass floor-selector panel */}
      <nav
        aria-label="Jump to floor"
        className="fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 rounded-full border border-[var(--glass-border)] bg-surface/70 p-2 backdrop-blur sm:flex"
      >
        {PROJECTS.map((p) => (
          <button
            key={p.floor}
            type="button"
            onClick={() => scrollToFloor(p.floor)}
            aria-label={`Go to floor ${p.floor}: ${p.name}`}
            aria-current={activeFloor === p.floor}
            className="group relative flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                activeFloor === p.floor
                  ? "scale-150 bg-brass shadow-[0_0_8px_var(--color-brass)]"
                  : "bg-ink-faint group-hover:bg-ink-dim"
              }`}
            />
            <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded bg-surface px-2 py-1 font-[family-name:var(--font-data)] text-[11px] text-ink-dim opacity-0 transition-opacity group-hover:opacity-100">
              {p.name}
            </span>
          </button>
        ))}
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
