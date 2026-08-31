"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Building from "./Building";
import ProjectScenery from "./ProjectScenery";
import type { Project } from "@/lib/projects";

export default function ProjectsDoor() {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div style={{ perspective: 1200 }} className="relative">
        {/* Door frame */}
        <div className="relative h-72 w-48 rounded-t-md border border-[var(--glass-border)] bg-surface-2 shadow-[0_0_60px_-20px_var(--color-crimson)] sm:h-96 sm:w-64">
          <motion.button
            type="button"
            aria-label={open ? "Close the door" : "Knock to open the door"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="absolute inset-1 origin-left rounded-t-sm bg-gradient-to-b from-surface to-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass"
            animate={{ rotateY: open ? -75 : 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Door panel detail */}
            <div className="absolute inset-4 rounded-sm border border-[var(--glass-border)]" />
            {/* Brass knob */}
            <span className="absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-brass shadow-[0_0_12px_var(--color-brass)]" />
          </motion.button>
        </div>

        {/* Knock label */}
        {!open && (
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-[family-name:var(--font-data)] text-xs tracking-wide text-brass"
          >
            knock / click
          </motion.span>
        )}
      </div>

      {!open && (
        <p className="max-w-sm text-sm text-ink-faint">
          15 floors. 15 projects. Knock to walk through them.
        </p>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectScenery
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {open && <Building onSelectProject={setSelectedProject} />}
    </div>
  );
}
