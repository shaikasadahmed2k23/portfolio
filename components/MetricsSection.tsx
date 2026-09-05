"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { METRICS, type Metric } from "@/lib/metrics";

function CountCard({ metric, index }: { metric: Metric; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, metric.value, {
      duration: 1.4,
      delay: index * 0.06,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, metric.value, index]);

  const formatted =
    metric.decimals !== undefined
      ? display.toFixed(metric.decimals)
      : Math.round(display).toLocaleString("en-US");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass rounded-lg p-5"
    >
      <div className="font-[family-name:var(--font-display)] text-3xl text-brass sm:text-4xl">
        {metric.prefix}
        {formatted}
        {metric.suffix}
      </div>
      <div className="mt-2 text-sm text-ink">{metric.label}</div>
      <div className="mt-1 font-[family-name:var(--font-data)] text-[10px] text-ink-faint">
        {metric.sub}
      </div>
    </motion.div>
  );
}

export default function MetricsSection() {
  return (
    <section className="relative px-6 py-24 sm:px-12 md:px-20">
      <div className="mx-auto max-w-6xl">
        <span className="font-[family-name:var(--font-data)] text-xs text-brass">
          METRICS THAT PROVE IT
        </span>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink sm:text-4xl">
          Numbers, not adjectives
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-dim">
          Every figure here traces back to a real deployed project or a graded hackathon result.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <CountCard key={m.label} metric={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
