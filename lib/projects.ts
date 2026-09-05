export type Project = {
  id: string;
  floor: number;
  name: string;
  tagline: string;
  problem: string;
  approach: string;
  challenge: string;
  result: string;
  // Architecture-diagram nodes — label + a one-line role shown on hover.
  nodes: { label: string; role: string }[];
};

// Fallback for the two projects without a locatable public repo yet —
// send Asad the README/repo link for these and swap the TBD fields.
const n = (label: string): { label: string; role: string } => ({
  label,
  role: "TBD — describe this component's role",
});

export const PROJECTS: Project[] = [
  {
    id: "agentrouter",
    floor: 15,
    name: "AgentRouter",
    tagline: "Cost-aware multi-agent LLM orchestration",
    problem:
      "Most multi-agent systems route every query to the most expensive model regardless of complexity — a \"what is 2+2\" costs the same as a distributed-systems design question.",
    approach:
      "A 4-agent pipeline — Planner → Complexity Scorer → Router → Executor → Synthesizer — scores each query 1-10 and routes it to the cheapest model tier that can still handle it, with a Redis semantic cache for instant repeat-query responses.",
    challenge:
      "Tuning the complexity scorer so cost savings don't come at the expense of quality on borderline queries, while keeping the routing explanation panel honest about exactly why each query went where it did.",
    result:
      "98.6% cost reduction vs GPT-4o, ~300ms latency on simple queries, sub-50ms on cache hits — deployed on Render (backend) + Vercel (frontend) for Black-Box Protocol 2026.",
    nodes: [
      { label: "Planner Agent", role: "Decomposes the query and estimates its complexity (1–10)" },
      { label: "Router", role: "Picks the cheapest model tier that can still handle the complexity score" },
      { label: "Executor Agents", role: "Run the subtask on the assigned model (Llama 3.1 8B / 3.3 70B)" },
      { label: "Synthesizer", role: "Merges subtask outputs into one final answer" },
    ],
  },
  {
    id: "mergeguard",
    floor: 14,
    name: "MergeGuard",
    tagline: "Autonomous multi-agent code review system",
    problem:
      "Every PR waits for a human regardless of actual risk — a one-line typo fix and a database migration sit in the same queue, so senior engineers burn hours on reviews that don't need judgment while reviewer fatigue lets genuinely risky changes slip through.",
    approach:
      "Five parallel Gemini agents (security, intent, diff, impact, context) analyze each PR's diff; a deterministic Blast Radius risk classifier and a per-developer Trust Profile combine with the agent scores to decide auto-merge, merge-with-warning, reject, or route to human — with a security finding able to force-reject regardless of every other score.",
    challenge:
      "Deciding when an AI can safely take an irreversible action like merging — the answer was requiring four independent layers (multi-agent consensus, risk-bounded autonomy, historical accountability, a non-negotiable security override) to all agree before acting alone, rather than trusting any single score.",
    result:
      "Validated against 13+ real pull requests — correctly auto-merged clean code (88–93/100), force-rejected SQL injection regardless of other scores, and routed a 95/100-scoring but sensitive auth change to human review. Built for AI House × Google for Developers.",
    nodes: [
      { label: "Security Agent", role: "Hardcoded secrets, injection, insecure auth — can force-reject alone" },
      { label: "Intent Agent", role: "Checks the PR description actually matches what the diff does" },
      { label: "Blast Radius", role: "Deterministic classifier for how sensitive the touched code is" },
      { label: "Decision Engine", role: "Combines agent scores + trust profile into the final call" },
    ],
  },
  {
    id: "dr-paws",
    floor: 13,
    name: "Dr. Paws",
    tagline: "Real-time veterinary voice agent",
    problem:
      "Veterinary clinics need instant triage and scheduling during emergencies, but phone-based intake is slow and inconsistent under pressure.",
    approach:
      "A LiveKit WebRTC voice agent handles real-time speech with LLM-based clinical reasoning, switching context mid-conversation between emergency triage and appointment booking, with n8n webhooks and Supabase handling real-time slot booking.",
    challenge:
      "Keeping end-to-end speech-to-response latency low enough to feel like a real phone call while the agent reasons about clinical urgency and juggles two different conversation modes with zero human handoff.",
    result:
      "Sub-2s end-to-end latency across 6 clinical emergency scenarios, fully autonomous triage-to-booking with no human intervention.",
    nodes: [
      { label: "Voice Input", role: "WebRTC mic stream from the caller" },
      { label: "LiveKit", role: "Real-time WebRTC transport, sub-2s round trip" },
      { label: "Reasoning", role: "LLM decides triage vs. scheduling and what to do next" },
      { label: "Response", role: "Spoken reply plus the n8n/Supabase action (booking, alert)" },
    ],
  },
  {
    id: "lexiq",
    floor: 12,
    name: "LexIQ",
    tagline: "Legal document intelligence RAG agent",
    problem: "TBD — couldn't find a public repo for this one, send me the README/repo link and I'll fill it in.",
    approach: "TBD — couldn't find a public repo for this one, send me the README/repo link and I'll fill it in.",
    challenge: "TBD — couldn't find a public repo for this one, send me the README/repo link and I'll fill it in.",
    result: "TBD — couldn't find a public repo for this one, send me the README/repo link and I'll fill it in.",
    nodes: [n("Document"), n("Retriever"), n("LLM"), n("Answer")],
  },
  {
    id: "stadiumpulse",
    floor: 11,
    name: "StadiumPulse",
    tagline: "Multi-agent smart stadium ecosystem",
    problem:
      "Stadium operations for an event like FIFA World Cup 2026 have to serve fans (navigation, multilingual help), staff (real-time incident response), and organizers (auditable operational intelligence) at once — one monolithic assistant can't do all three well.",
    approach:
      "Five narrow, single-responsibility agents — Crowd Intelligence, Wayfinding, Anomaly Detector, Decision Orchestrator, Fan Assistant — share a common BaseAgent for Gemini calls and reasoning logs. Wayfinding's BFS pathfinding consumes Crowd Intelligence's live congestion output so routes actually avoid hotspots instead of routing blind.",
    challenge:
      "Tuning the Anomaly Detector's surge threshold (25%+ occupancy jump or sustained critical status) so it catches real incidents without spamming false-positive alerts on every 5-second sensor poll.",
    result:
      "A live Control Room dashboard streams zone occupancy, incidents, and prioritized, confidence-scored recommendations over WebSocket every 5 seconds, each carrying its own reasoning factors for organizer audit — built for Hack2Skill PromptWars Round 4.",
    nodes: [
      { label: "Crowd Intelligence", role: "Classifies zone occupancy normal/elevated/critical, extrapolates a 10-min trend" },
      { label: "Wayfinding", role: "BFS routing that avoids zones Crowd Intelligence flags as congested" },
      { label: "Anomaly Detector", role: "Auto-raises incidents on a 25%+ occupancy jump or sustained critical status" },
      { label: "Decision Orchestrator", role: "Aggregates everything into prioritized, reasoned staff recommendations" },
    ],
  },
  {
    id: "islamic-rag",
    floor: 10,
    name: "Islamic Guidance RAG",
    tagline: "Deployed RAG system over Islamic guidance corpus",
    problem:
      "People seeking answers to Islamic questions online risk AI hallucination on a topic where the authenticity and traceability of sources matters deeply.",
    approach:
      "Every answer is retrieved from 101,502 embedded chunks — 3 Quran translations, 4 authentic Hadith collections, and Tafsir Ibn Kathir — via ChromaDB semantic search, then grounded and explained by Groq LLaMA 3 70B, with an emotional-intelligence layer that detects hardship or grief and responds with relevant Prophetic stories.",
    challenge:
      "Keeping every claim traceable to a real verse or hadith at scale, across 100k+ chunks, without the LLM drifting into unsourced generation.",
    result:
      "Deployed live RAG system combining 3 translations per answer, contextual Zikr suggestions, a rotating daily-hadith feature, and full question logging to Supabase for continuous improvement.",
    nodes: [
      { label: "Corpus", role: "Quran (3 translations), 4 Hadith collections, Tafsir Ibn Kathir — 101,502 chunks" },
      { label: "Vector DB", role: "ChromaDB semantic search over the embedded chunks" },
      { label: "Retriever", role: "Classifies question type (emotional/doubt/comparative), pulls top matches" },
      { label: "LLM", role: "Groq LLaMA 3 70B grounds the answer in retrieved verses/hadith only" },
    ],
  },
  {
    id: "devcrew",
    floor: 9,
    name: "DevCrew",
    tagline: "6-agent CrewAI pipeline",
    problem:
      "Turning a plain-language project idea into working, well-structured code end-to-end normally needs a human developer at every step — stack choice, architecture, implementation, and testing.",
    approach:
      "6 CrewAI agents — Goal Analyst → Tech Advisor → Planner → Coder → Tester → QA — run as separate sequential crews with deliberate delays between them, then package the result as a downloadable ZIP with a README, .env.example, and build log.",
    challenge:
      "Groq's free-tier rate limits (6k-12k tokens/min) kept killing multi-agent runs; the fix was running each agent as its own crew with 25s delays, turning a fast-but-fragile 30-second build into a reliable 3-5 minute one. Separately, the Coder agent kept bleeding CrewAI patterns into LangChain/Node.js output until each stack got its own real reference example baked into the agent's backstory, not just written rules.",
    result:
      "Generated-code quality: ~95% for CrewAI projects, ~85% for LangChain Python, ~80% for Vanilla Python — built and shipped in one weekend.",
    nodes: [
      { label: "Goal Analyst", role: "Understands the plain-language project idea" },
      { label: "Tech Advisor", role: "Recommends the real tech stack, honestly, even if it's \"don't use CrewAI here\"" },
      { label: "Coder", role: "Writes every file, using a stack-specific reference example, not just rules" },
      { label: "QA", role: "Tests for broken imports, missing functions, logic errors before packaging" },
    ],
  },
  {
    id: "smart-email",
    floor: 8,
    name: "Smart Email Agent",
    tagline: "5-node autonomous Gmail pipeline",
    problem:
      "Important emails get buried across a busy inbox, with no automatic way to separate spam and low-priority noise from things that actually need action.",
    approach:
      "An n8n-orchestrated pipeline classifies every incoming email with Groq LLaMA 3.3 into spam/useful/unsure and high/medium/low priority with stated reasoning, routes high-priority mail instantly, detects calendar events and saves them straight to Google Calendar, and compiles the rest into a periodic digest.",
    challenge:
      "Getting classification confident enough to route high-priority mail instantly without over-flagging routine messages, and reliably pulling structured event details (title/date/time/location) out of unstructured email text.",
    result:
      "Automatic spam/priority classification with per-email reasoning, calendar events auto-saved to Google Calendar, and feedback logs feeding continuous classifier improvement.",
    nodes: [
      { label: "Inbox", role: "n8n watches the connected mailbox" },
      { label: "Classifier", role: "Groq LLaMA 3.3 scores spam/useful/unsure + priority, with reasoning" },
      { label: "Event Extractor", role: "Pulls event details and saves them to Google Calendar" },
      { label: "Digest", role: "Periodic prioritized summary email for medium/low priority mail" },
    ],
  },
  {
    id: "regulanet",
    floor: 7,
    name: "RegulaNet AI",
    tagline: "Financial compliance multi-agent system",
    problem:
      "Manually auditing financial transactions for regulatory violations is slow and inconsistent across a large compliance team.",
    approach:
      "5 specialized Gemini agents — Legal Ingestion, Transaction Understanding, Compliance Reasoning, Explanation, Risk Assessment — analyze each transaction, feeding a React/Flask dashboard with JWT-secured role-based access, real-time risk-level filtering, and PDF/CSV export.",
    challenge:
      "Keeping five sequential reasoning agents consistent with each other, so the final risk score and its plain-English explanation never contradict one another on the same transaction.",
    result:
      "Live dashboard showing total transactions, violations, compliance rate, and critical-issue counts, with per-transaction expandable AI explanations and separate admin/employee views.",
    nodes: [
      { label: "Legal Ingestion", role: "Reads in the regulatory rules and context" },
      { label: "Transaction Understanding", role: "Parses each transaction's details" },
      { label: "Compliance Reasoning", role: "Gemini checks the transaction against ingested rules" },
      { label: "Risk Assessment", role: "Scores severity (Critical/High/Medium/Low) for the dashboard" },
    ],
  },
  {
    id: "spice-garden",
    floor: 6,
    name: "Spice Garden",
    tagline: "Live restaurant ordering system",
    problem:
      "Small restaurants need a low-friction digital ordering system without expensive POS hardware or per-order platform fees.",
    approach:
      "n8n workflow automation runs the whole order lifecycle — a QR code at each table opens a mobile-optimized menu, orders trigger an instant HTML email receipt to the customer and a plain-text kitchen alert, with GST billing and UPI/cash tracking built in.",
    challenge:
      "Keeping two very differently-formatted emails — a polished customer receipt vs. a fast-scan kitchen alert — generating reliably off the same order event, without duplicating the underlying order logic.",
    result:
      "End-to-end automated ordering, QR scan to kitchen notification to billed receipt, with zero manual order entry.",
    nodes: [
      { label: "QR Menu", role: "Table-side entry point, no app download" },
      { label: "Order", role: "Cart, UPI/cash selection, GST billing" },
      { label: "Kitchen Alert", role: "Plain-text, prep-ready notification" },
      { label: "Customer Receipt", role: "Itemized HTML email confirmation" },
    ],
  },
  {
    id: "team-task-manager",
    floor: 5,
    name: "Team Task Manager",
    tagline: "Full-stack board with JWT auth and RBAC",
    problem:
      "Small teams need Trello/Asana-style collaborative task tracking without paying for a full project-management SaaS seat per person.",
    approach:
      "A React + Vite frontend with drag-and-drop Kanban columns talks to a Node/Express + Supabase backend secured with JWT auth — project creators become admins and can invite teammates by email.",
    challenge:
      "Getting drag-and-drop task movement across To Do / In Progress / Done to sync reliably with the backend, including correct overdue-task detection, without race conditions on rapid moves.",
    result:
      "Deployed full-stack board with dashboard analytics — task counts by status, overdue tracking, recent-projects list, progress bars — built for the Ethara.AI full-stack assignment.",
    nodes: [
      { label: "Auth", role: "JWT signup/login, protected routes" },
      { label: "Board", role: "Drag-and-drop Kanban (To Do / In Progress / Done)" },
      { label: "API", role: "Node/Express endpoints for projects, tasks, membership" },
      { label: "DB", role: "Supabase Postgres" },
    ],
  },
  {
    id: "trendly",
    floor: 4,
    name: "Trendly Support Agent",
    tagline: "Agentic support assistant for a retailer",
    problem:
      "Agentic support bots that let an LLM directly judge return/refund eligibility risk hallucinating policy details — a wrong \"yes you can return this\" costs real money and trust.",
    approach:
      "A bounded ReAct tool-calling loop (Groq openai/gpt-oss-120b) resolves customer identity conversationally, then calls out to a separate deterministic Python policy engine for every eligibility decision — the LLM handles conversation, never policy judgment.",
    challenge:
      "Two real deploy bugs only surfaced in production-like conditions: Render defaulted to Python 3.14 with no prebuilt wheel for pydantic-core yet (fixed by pinning PYTHON_VERSION), and a CORS preflight failure that curl-based testing couldn't catch, since curl never triggers the browser preflight request that broke it.",
    result:
      "19 passing pytest scenarios covering clean paths, date boundaries, category restrictions, and adversarial injection attempts; deployed live with UptimeRobot keeping the Render free-tier backend warm through grading.",
    nodes: [
      { label: "Identity Resolution", role: "Resolves the customer conversationally, no login form" },
      { label: "ReAct Agent", role: "Groq gpt-oss-120b tool-calling loop, bounded steps" },
      { label: "Policy Engine", role: "Deterministic Python that actually decides eligibility" },
      { label: "Escalation", role: "Structured human handoff for lost parcels or disputes" },
    ],
  },
  {
    id: "vedaai",
    floor: 3,
    name: "VedaAI Assessment",
    tagline: "Answer-sheet extraction and mapping",
    problem:
      "Grading handwritten answer sheets against a question paper is slow, and it's hard for a teacher to verify exactly where in the handwriting a given grade came from.",
    approach:
      "Three chained Gemini multimodal calls: extract every question (with sub-parts) from the question paper, transcribe the handwritten answers with bounding boxes, then map answers to questions and grade them — the browser renders the answer sheet and highlights the exact region a teacher clicks.",
    challenge:
      "Keeping the bounding-box highlight accurate at any zoom level, and handling answers that visibly span multiple pages, since grading runs off the transcribed text rather than a second pass over the raw handwriting image.",
    result:
      "Full question-to-answer traceability with click-to-highlight grading, built on Gemini 3.6 Flash's structured JSON output for reliable parsing at every stage.",
    nodes: [
      { label: "Question Extraction", role: "Gemini reads the question paper, preserves numbering/sub-parts" },
      { label: "Answer Extraction", role: "Transcribes handwriting + a bounding box per answer block" },
      { label: "Mapper", role: "Matches answers to questions (written label first, semantic fallback)" },
      { label: "Grader", role: "Scores each matched answer with a short feedback comment" },
    ],
  },
  {
    id: "visual-search",
    floor: 2,
    name: "Visual Product Search",
    tagline: "CLIP-based visual product search engine",
    problem: "TBD — couldn't find a public repo for this one, send me the README/repo link and I'll fill it in.",
    approach: "TBD — couldn't find a public repo for this one, send me the README/repo link and I'll fill it in.",
    challenge: "TBD — couldn't find a public repo for this one, send me the README/repo link and I'll fill it in.",
    result: "TBD — couldn't find a public repo for this one, send me the README/repo link and I'll fill it in.",
    nodes: [n("Image"), n("CLIP"), n("Vector Index"), n("Results")],
  },
  {
    id: "whatsapp-digest",
    floor: 1,
    name: "WhatsApp Digest Bot",
    tagline: "Priority-classified WhatsApp digest via Baileys + Groq",
    problem:
      "A friend active in many WhatsApp hackathon and volunteer groups kept missing important messages buried in constant group noise.",
    approach:
      "Baileys logs into WhatsApp Web, captures every message into a local JSON DB, and a node-cron job every 6 hours batches unread messages to Groq for spam/priority classification, then emails two digests via Resend — a detailed per-message breakdown and a 10-second chat-overview scan.",
    challenge:
      "Railway blocks outbound SMTP ports at the network level, so email had to go through Resend's HTTPS API instead of SMTP; Groq's free-tier daily token limit also means a single 500+ message digest cycle can exhaust that day's quota mid-run.",
    result:
      "Deployed on Railway with a persistent volume for session + message DB; runs 4x-daily digests (12am/6am/12pm/6pm IST) with priority tuned so plain greetings correctly land as medium, not high.",
    nodes: [
      { label: "Baileys", role: "WhatsApp Web session, QR login, persists after first scan" },
      { label: "Classifier", role: "Groq scores priority + spam every 6-hour cycle" },
      { label: "Digest", role: "Detailed per-message email + compact chat-overview email" },
      { label: "Email", role: "Sent via Resend's HTTPS API (Railway blocks SMTP ports)" },
    ],
  },
];
