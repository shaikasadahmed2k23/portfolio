"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BOOT_LINE = "$ initializing asad_ahmed.ai...";
const TAGLINE = "AI agents that talk to each other, not just to you.";

export default function TerminalBoot() {
  const [typed, setTyped] = useState("");
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped(BOOT_LINE.slice(0, i));
      if (i >= BOOT_LINE.length) {
        clearInterval(interval);
        setTimeout(() => setBootDone(true), 350);
      }
    }, 38);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start gap-6">
      <div
        className="glass rounded-lg px-5 py-3 font-[family-name:var(--font-data)] text-sm text-brass"
        aria-live="polite"
      >
        {typed}
        <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-brass" />
      </div>

      {bootDone && (
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.15] text-ink sm:text-5xl md:text-6xl"
        >
          {TAGLINE}
        </motion.h1>
      )}

      {bootDone && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-md text-base text-ink-dim"
        >
          Shaik Asad Ahmed — final-year AI engineer, building multi-agent
          systems that actually ship.
        </motion.p>
      )}
    </div>
  );
}
