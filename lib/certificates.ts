export type Certificate = {
  id: string;
  event: string;
  result: string;
  year: string;
  // Path under /public once the real certificate image is added, e.g.
  // "/certificates/agentathon-2025.jpg". Left empty renders a placeholder tile.
  image?: string;
};

// Placeholder wall — swap in real scanned/exported certificate images by
// setting `image` on each entry (drop files in public/certificates/), and
// add more entries for the rest of the 30-40 certs whenever ready.
export const CERTIFICATES: Certificate[] = [
  { id: "agentathon-2025", event: "Agentathon 2025 — GDG Hyderabad", result: "Guinness World Record hackathon", year: "2025" },
  { id: "unisys-2025", event: "Unisys Innovation Challenge 2025", result: "Pre-Finalist — shortlisted from 12,000+", year: "2025" },
  { id: "devengers-promptwars", event: "DEVENGERS PromptWars 2026 — Round 4", result: "Rank #6 / 683 — 95.42 / 100", year: "2026" },
  { id: "ecovillage-r3", event: "Hack2Skill Prompt Wars — Round 3", result: "Rank #173 / 30,909 — 94.08 / 100", year: "2026" },
  { id: "supervity-autopilot", event: "Supervity Autopilot Asia Hackathon", result: "Finalist — Kuala Lumpur", year: "2026" },
  { id: "hackerrank-orchestrate", event: "HackerRank Orchestrate", result: "Multi-modal evidence review, 24h sprint", year: "2026" },
  { id: "gridlock", event: "Gridlock — Traffic Demand Prediction", result: "Leaderboard score 91.13", year: "2026" },
  { id: "examfort", event: "ExamFort Hackathon", result: "Full-stack AI exam platform", year: "2026" },
  { id: "trafficiq", event: "Smart Traffic Management — Round 2", result: "TrafficIQ dashboard build", year: "2026" },
  { id: "mergeguard-aihouse", event: "AI House × Google for Developers", result: "MergeGuard — multi-agent code review", year: "2026" },
  { id: "agentrouter-blackbox", event: "Black-Box Protocol 2026", result: "AgentRouter — cost-aware orchestration", year: "2026" },
  { id: "lexiq-arch", event: "IIT Kharagpur — The Arch", result: "LexIQ — legal document RAG agent", year: "2026" },
];
