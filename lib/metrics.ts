export type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  sub: string;
};

export const METRICS: Metric[] = [
  { value: 15, label: "Projects shipped end-to-end", sub: "From idea to deployed URL" },
  { value: 98.6, suffix: "%", decimals: 1, label: "Cost cut vs GPT-4o", sub: "AgentRouter" },
  { value: 6, prefix: "#", label: "Rank out of 683 teams", sub: "DEVENGERS PromptWars 2026" },
  { value: 173, prefix: "#", label: "Rank out of 30,909 — top 0.6%", sub: "Hack2Skill PromptWars Round 3" },
  { value: 13, suffix: "+", label: "Real PRs reviewed autonomously", sub: "MergeGuard" },
  { value: 2, prefix: "<", suffix: "s", label: "End-to-end voice latency", sub: "Dr. Paws" },
  { value: 101502, label: "Indexed Quran + Hadith chunks", sub: "Islamic Guidance RAG" },
  { value: 12000, suffix: "+", label: "Applicants — Pre-Finalist", sub: "Unisys Innovation Challenge 2025" },
];
