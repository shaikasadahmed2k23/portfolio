"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

const SECTIONS: { key: keyof Project; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "approach", label: "Approach" },
  { key: "challenge", label: "Challenge tackled" },
  { key: "result", label: "Result" },
];

export default function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} case study`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-void/90 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="glass max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="float-right font-[family-name:var(--font-data)] text-sm text-ink-dim hover:text-brass"
        >
          close ✕
        </button>
        <h3 className="mb-1 font-[family-name:var(--font-display)] text-2xl text-ink">
          {project.name}
        </h3>
        <p className="mb-6 text-sm text-ink-dim">{project.tagline}</p>

        <div className="flex flex-col gap-5">
          {SECTIONS.map(({ key, label }) => (
            <div key={key}>
              <div className="mb-1 font-[family-name:var(--font-data)] text-xs text-brass">
                {label}
              </div>
              <p className="text-sm leading-relaxed text-ink-dim">
                {String(project[key])}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
