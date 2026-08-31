"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/lib/projects";
import CaseStudyModal from "./CaseStudyModal";

export default function ProjectScenery({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const radius = 150;
  const positions = project.nodes.map((_, i) => {
    const angle = (i / project.nodes.length) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} architecture`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-void/95 px-6 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-6 top-6 font-[family-name:var(--font-data)] text-sm text-ink-dim hover:text-brass"
      >
        close ✕
      </button>

      <span className="font-[family-name:var(--font-data)] text-xs text-brass">
        FLOOR {String(project.floor).padStart(2, "0")}
      </span>
      <h2 className="mb-8 font-[family-name:var(--font-display)] text-3xl text-ink sm:text-4xl">
        {project.name}
      </h2>

      {/* Node diagram */}
      <div className="relative h-[340px] w-[340px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="-170 -170 340 340" aria-hidden>
          {positions.map((pos, i) => (
            <motion.line
              key={`line-${i}`}
              x1={0}
              y1={0}
              x2={pos.x}
              y2={pos.y}
              stroke="var(--color-crimson)"
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 0.6, delay: 0.15 * i }}
            />
          ))}
        </svg>

        {/* Center node */}
        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-crimson shadow-[0_0_24px_var(--color-crimson)]">
          <span className="font-[family-name:var(--font-data)] text-[10px] text-ink">core</span>
        </div>

        {positions.map((pos, i) => (
          <motion.button
            key={i}
            type="button"
            onMouseEnter={() => setHoveredNode(i)}
            onMouseLeave={() => setHoveredNode(null)}
            onFocus={() => setHoveredNode(i)}
            onBlur={() => setHoveredNode(null)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 * i + 0.3 }}
            style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)` }}
            className="glass absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs text-ink-dim hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass"
          >
            {project.nodes[i].label}
          </motion.button>
        ))}
      </div>

      <div className="mt-4 h-5 font-[family-name:var(--font-data)] text-xs text-ink-dim">
        {hoveredNode !== null ? project.nodes[hoveredNode].role : ""}
      </div>

      <button
        type="button"
        onClick={() => setCaseStudyOpen(true)}
        className="mt-8 rounded-full border border-brass px-6 py-2 font-[family-name:var(--font-data)] text-sm text-brass transition-colors hover:bg-brass hover:text-void"
      >
        read the case study
      </button>

      {caseStudyOpen && (
        <CaseStudyModal project={project} onClose={() => setCaseStudyOpen(false)} />
      )}
    </motion.div>
  );
}
