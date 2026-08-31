export type Project = {
  id: string;
  floor: number;
  name: string;
  tagline: string;
  // Case-study fields — placeholders. Fill in from the project's README.
  problem: string;
  approach: string;
  challenge: string;
  result: string;
  // Architecture-diagram nodes — label + a one-line role shown on hover.
  nodes: { label: string; role: string }[];
};

const n = (label: string): { label: string; role: string } => ({
  label,
  role: "TBD — describe this component's role",
});

export const PROJECTS: Project[] = [
  { id: "agentrouter", floor: 15, name: "AgentRouter", tagline: "Cost-aware multi-agent LLM orchestration", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Router"), n("Agent A"), n("Agent B"), n("Cost Monitor")] },
  { id: "mergeguard", floor: 14, name: "MergeGuard", tagline: "Autonomous multi-agent code review system", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("PR Trigger"), n("Review Agent"), n("Security Agent"), n("Report")] },
  { id: "dr-paws", floor: 13, name: "Dr. Paws", tagline: "Real-time veterinary voice agent", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Voice Input"), n("LiveKit"), n("Reasoning"), n("Response")] },
  { id: "lexiq", floor: 12, name: "LexIQ", tagline: "Legal document intelligence RAG agent", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Document"), n("Retriever"), n("LLM"), n("Answer")] },
  { id: "stadiumpulse", floor: 11, name: "StadiumPulse", tagline: "Multi-agent smart stadium ecosystem", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Sensors"), n("Agents"), n("Dashboard")] },
  { id: "islamic-rag", floor: 10, name: "Islamic Guidance RAG", tagline: "Deployed RAG system over Islamic guidance corpus", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Corpus"), n("Vector DB"), n("Retriever"), n("LLM")] },
  { id: "devcrew", floor: 9, name: "DevCrew", tagline: "6-agent CrewAI pipeline", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Planner"), n("Coder"), n("Reviewer"), n("Tester")] },
  { id: "smart-email", floor: 8, name: "Smart Email Agent", tagline: "5-node autonomous Gmail pipeline", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Inbox"), n("Classifier"), n("Drafter"), n("Send")] },
  { id: "regulanet", floor: 7, name: "RegulaNet AI", tagline: "Financial compliance multi-agent system", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Filing"), n("Compliance Agent"), n("Alert")] },
  { id: "spice-garden", floor: 6, name: "Spice Garden", tagline: "Live restaurant ordering system", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Order"), n("Kitchen"), n("Billing")] },
  { id: "team-task-manager", floor: 5, name: "Team Task Manager", tagline: "Full-stack board with JWT auth and RBAC", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Auth"), n("Board"), n("API"), n("DB")] },
  { id: "trendly", floor: 4, name: "Trendly Support Agent", tagline: "Agentic support assistant for a retailer", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Query"), n("Agent"), n("Order System")] },
  { id: "vedaai", floor: 3, name: "VedaAI Assessment", tagline: "Answer-sheet extraction and mapping", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Upload"), n("OCR"), n("Mapper"), n("Score")] },
  { id: "visual-search", floor: 2, name: "Visual Product Search", tagline: "CLIP-based visual product search engine", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Image"), n("CLIP"), n("Vector Index"), n("Results")] },
  { id: "whatsapp-digest", floor: 1, name: "WhatsApp Digest Bot", tagline: "Priority-classified WhatsApp digest via Baileys + Groq", problem: "TBD — pull from README", approach: "TBD", challenge: "TBD", result: "TBD", nodes: [n("Baileys"), n("Classifier"), n("Digest"), n("Email")] },
];
