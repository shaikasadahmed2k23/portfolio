# Asad Ahmed — Portfolio

Cinematic story-mode portfolio. Built with Next.js, Three.js, Framer Motion.

## Status
- [x] Design tokens (colors, type, glass utility) — `app/globals.css`
- [x] Hero — terminal boot sequence + tagline
- [x] Projects door — knock/click interaction, opens (building floors coming next)
- [x] Building — 15 floors as an actual stacked elevation (floor slabs on top of one another, rooftop/base caps), "close door" exit reachable from any floor
- [x] Project scenery — animated node diagram, hover-to-explain roles, case-study modal (Problem/Approach/Challenge/Result)
- [ ] Metrics counters
- [ ] Hackathon certificate wall (grid, click-to-zoom)
- [ ] Ask My Portfolio — Groq-powered RAG chatbot
- [ ] Closing / contact

## Run locally
```bash
npm install
npm run dev
```

Note: `next/font/google` needs internet access to fetch Instrument Serif, Manrope,
and JetBrains Mono at build time — works fine on Vercel/local dev with normal
internet, just flagged here in case a sandboxed CI blocks it.

## Content still needed (not fabricated — needs your input)
`lib/projects.ts` has all 15 floors wired up structurally, but every
`problem` / `approach` / `challenge` / `result` field and every node's
`role` is a "TBD" placeholder. Send over the READMEs (same ones for the
chatbot) and I'll fill these in for real — didn't want to invent case-study
details that'd show up as false claims on the live site.
