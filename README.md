# Asad Ahmed — Portfolio

Cinematic story-mode portfolio. Built with Next.js, Three.js, Framer Motion.

## Status
- [x] Design tokens (colors, type, glass utility) — `app/globals.css`
- [x] Hero — terminal boot sequence + tagline
- [x] Projects door — knock/click interaction, opens (building floors coming next)
- [ ] Building — 15 floors / 15 projects, elevator scroll + floor-selector panel
- [ ] Project scenery — architecture diagram animation + case-study modal
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
