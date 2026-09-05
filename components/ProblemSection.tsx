"use client";

import { motion } from "framer-motion";

type ProblemCard = {
  problem: string;
  resolution: string;
  project: string;
};

const CARDS: ProblemCard[] = [
  {
    problem: "Most AI systems don't know when to trust themselves.",
    resolution:
      "Four independent layers — multi-agent consensus, risk-bounded autonomy, historical trust, a non-negotiable security override — all have to agree before an agent acts alone.",
    project: "MergeGuard",
  },
  {
    problem: "Every query costs the same, whether it's trivial or complex.",
    resolution:
      "A planner scores complexity 1–10 and routes each query to the cheapest model that can still handle it, with semantic caching for the repeats.",
    project: "AgentRouter",
  },
  {
    problem: "Chatbots hallucinate hardest on the topics that matter most.",
    resolution:
      "Every answer is retrieved from 100k+ sourced chunks and grounded in the actual text — never generated from a guess.",
    project: "Islamic Guidance RAG",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative px-6 py-24 sm:px-12 md:px-20">
      <div className="mx-auto max-w-5xl">
        <span className="font-[family-name:var(--font-data)] text-xs text-brass">
          THE PROBLEM I SOLVE
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-2 max-w-2xl font-[family-name:var(--font-display)] text-3xl leading-tight text-ink sm:text-4xl"
        >
          Most AI demos stop at the chatbot. I ship what&apos;s underneath it.
        </motion.h2>
        <p className="mt-3 max-w-xl text-sm text-ink-dim">
          Every project on this site is an answer to a specific failure mode I kept
          running into building agentic systems — not a feature list.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.project}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              className="glass flex flex-col rounded-lg p-5"
            >
              <p className="font-[family-name:var(--font-display)] text-lg leading-snug text-ink">
                {c.problem}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim">{c.resolution}</p>
              <div className="mt-4 font-[family-name:var(--font-data)] text-[10px] text-brass">
                — {c.project}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
