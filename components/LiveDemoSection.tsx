"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HIGH_SIGNAL = [
  "architecture",
  "design",
  "distributed",
  "algorithm",
  "optimi",
  "compare",
  "analyze",
  "explain in detail",
  "trade-off",
  "tradeoff",
  "system",
  "strategy",
  "why",
  "how does",
];

const LOW_SIGNAL = ["what is", "hi", "hello", "hey", "capital of", "define", "who is"];

const PRESETS = [
  "What is 2 + 2?",
  "Explain in detail how a distributed consensus algorithm handles network partitions",
  "Design a cost-optimal architecture for a real-time multi-agent system",
];

type Tier = {
  name: string;
  note: string;
  costPer1k: number; // illustrative $ per 1k queries, not real pricing
};

const TIERS: Record<"simple" | "medium" | "complex", Tier> = {
  simple: { name: "Llama 3.1 8B", note: "fastest & cheapest", costPer1k: 0.6 },
  medium: { name: "Llama 3.3 70B", note: "balanced", costPer1k: 6.5 },
  complex: { name: "Llama 3.3 70B", note: "deep reasoning", costPer1k: 8.2 },
};

const GPT4O_COST_PER_1K = 45; // illustrative baseline, matches the ~98.6% figure at the cheap tier

function scoreComplexity(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 1;
  const lower = trimmed.toLowerCase();
  const words = trimmed.split(/\s+/).filter(Boolean).length;

  let score = Math.min(6, Math.round(words / 5));

  for (const kw of HIGH_SIGNAL) {
    if (lower.includes(kw)) score += 1;
  }
  // Word-boundary match for low-signal terms — plain `includes` would false-
  // positive on substrings like "hi" inside "architecture" or "hey" inside "they".
  for (const kw of LOW_SIGNAL) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`);
    if (re.test(lower)) score -= 2;
  }

  return Math.max(1, Math.min(10, score));
}

function tierFor(score: number): "simple" | "medium" | "complex" {
  if (score <= 4) return "simple";
  if (score <= 7) return "medium";
  return "complex";
}

export default function LiveDemoSection() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ score: number; tier: "simple" | "medium" | "complex" } | null>(
    null
  );

  const run = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setQuery(q);
    const score = scoreComplexity(q);
    setResult({ score, tier: tierFor(score) });
  };

  const tier = result ? TIERS[result.tier] : null;
  const savingsPct = tier ? Math.round((1 - tier.costPer1k / GPT4O_COST_PER_1K) * 100) : null;

  return (
    <section className="relative px-6 py-24 sm:px-12 md:px-20">
      <div className="mx-auto max-w-4xl">
        <span className="font-[family-name:var(--font-data)] text-xs text-brass">
          LIVE INTERACTIVE DEMO
        </span>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink sm:text-4xl">
          Try AgentRouter&apos;s routing logic
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-dim">
          Type a query and see how it would get scored and routed. This runs
          entirely in your browser using the real scoring bands from the
          project&apos;s README — no API calls, no live model.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => run(p)}
              className="glass rounded-full px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-brass/60 hover:text-ink"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run(query)}
            placeholder="Ask anything…"
            className="flex-1 rounded-md border border-[var(--glass-border)] bg-surface-2/50 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brass/60"
          />
          <button
            type="button"
            onClick={() => run(query)}
            disabled={!query.trim()}
            className="rounded-md border border-brass/50 px-5 py-3 font-[family-name:var(--font-data)] text-xs text-brass transition-colors hover:bg-brass/10 disabled:opacity-40"
          >
            route it
          </button>
        </div>

        <AnimatePresence mode="wait">
          {result && tier && (
            <motion.div
              key={result.score + result.tier}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              {/* pipeline */}
              <div className="glass flex flex-wrap items-center gap-2 rounded-lg p-4 font-[family-name:var(--font-data)] text-[11px] text-ink-dim">
                <span className="rounded bg-surface-2 px-2 py-1">Query</span>
                <span className="text-brass">→</span>
                <span className="rounded bg-surface-2 px-2 py-1">
                  Planner <span className="text-brass">({result.score}/10)</span>
                </span>
                <span className="text-brass">→</span>
                <span className="rounded bg-surface-2 px-2 py-1">Router</span>
                <span className="text-brass">→</span>
                <span className="rounded bg-brass/15 px-2 py-1 text-brass">
                  {tier.name}
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="glass rounded-lg p-4">
                  <div className="font-[family-name:var(--font-data)] text-[10px] text-brass">
                    COMPLEXITY
                  </div>
                  <div className="mt-1 font-[family-name:var(--font-display)] text-2xl text-ink">
                    {result.score} / 10
                  </div>
                </div>
                <div className="glass rounded-lg p-4">
                  <div className="font-[family-name:var(--font-data)] text-[10px] text-brass">
                    ROUTED TO
                  </div>
                  <div className="mt-1 font-[family-name:var(--font-display)] text-lg text-ink">
                    {tier.name}
                  </div>
                  <div className="text-xs text-ink-faint">{tier.note}</div>
                </div>
                <div className="glass rounded-lg p-4">
                  <div className="font-[family-name:var(--font-data)] text-[10px] text-brass">
                    EST. SAVINGS
                  </div>
                  <div className="mt-1 font-[family-name:var(--font-display)] text-2xl text-ink">
                    ~{savingsPct}%
                  </div>
                  <div className="text-xs text-ink-faint">vs always-GPT-4o</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
