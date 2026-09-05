"use client";

import { motion } from "framer-motion";

const LINKS = [
  {
    label: "Email",
    value: "shaikasadahmed2k23@gmail.com",
    href: "mailto:shaikasadahmed2k23@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/shaikasadahmed2k23",
    href: "https://github.com/shaikasadahmed2k23",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/shaik-asad-ahmed",
    href: "https://www.linkedin.com/in/shaik-asad-ahmed-224b9b2a8/",
  },
];

export default function ClosingSection() {
  return (
    <section className="relative border-t border-[var(--glass-border)] px-6 py-24 sm:px-12 md:px-20">
      <div className="mx-auto max-w-4xl text-center">
        <span className="font-[family-name:var(--font-data)] text-xs text-brass">
          THE LAST FLOOR
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mt-2 max-w-xl font-[family-name:var(--font-display)] text-3xl leading-tight text-ink sm:text-4xl"
        >
          15 floors built. One conversation left — with you.
        </motion.h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-dim">
          Final-year AI engineer, based in Kurnool, graduating 2026 — open to AI
          engineering, backend, and agentic-systems roles.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="glass group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-ink transition-colors hover:border-brass/60"
            >
              <span className="font-[family-name:var(--font-data)] text-[10px] text-brass">
                {link.label}
              </span>
              <span className="text-ink-dim group-hover:text-ink">{link.value}</span>
            </a>
          ))}
        </div>

        <div className="mt-16 font-[family-name:var(--font-data)] text-[10px] text-ink-faint">
          built with Next.js · Three.js · Framer Motion — © {new Date().getFullYear()} Shaik Asad Ahmed
        </div>
      </div>
    </section>
  );
}
