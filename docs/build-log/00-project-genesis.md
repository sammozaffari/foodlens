# Build Log 00: Project Genesis

**Date:** 2026-05-26
**Phase:** Pre-development

---

## The Problem I Saw

I'm someone who reads ingredient labels. I flip the packet, squint at the fine print, Google the additive numbers, and try to make sense of it all in a supermarket aisle with two kids and a trolley full of contradictions.

Australia is the allergy capital of the world — over 5 million people living with allergic disease. I watched my partner navigate a coeliac diagnosis with zero adequate tooling. Every app we tried either didn't recognise Australian products, scored things using European standards that don't apply here, or was so out of date it was useless.

When I actually researched the space, the gap was staggering:

- **Yuka** (80M users) doesn't understand Health Star Ratings and suggests European alternatives you can't buy here
- **FoodSwitch** (the only AU-specific option) recognised 1 in 3 products in testing
- **MyFitnessPal** imploded in 2025 — paywalled barcode scanning, 3-5 second lag per screen, user revolt
- **Not a single platform** combines ingredient transparency with community features

The $148 billion Australian grocery market is served by tools that are fragmented, inaccurate, or hostile to users.

---

## The Opportunity

This isn't just a consumer tool. It's an intelligence platform.

If you build a trusted food transparency app that hundreds of thousands of Australians use daily, you're sitting on the most valuable dataset in the grocery industry: what real people actually want to eat, what they avoid, what gaps they see in supermarket shelves.

**The consumer side:** Scan a product, understand what's in it, find better alternatives.

**The B2B side:** Aggregate anonymised demand signals and sell them to the manufacturers and supermarkets who make those products. When 3,000 users search for "celiac-safe muesli bars under $1 with no added sugar" and find nothing — that's a new product development brief worth money.

Regulatory tailwinds are accelerating this: mandatory Health Star Ratings are in legislative preparation, PEAL allergen labelling requirements took effect February 2026, and added sugar labelling is in consultation.

---

## Why I'm Building It Myself

I'm a designer who can research, prototype, and ship. This project proves it — not with a mock-up, but with a working product that solves a real problem for a real market.

The research brief (see `docs/research/brief.md`) covers the full competitive landscape, user pain points, technical feasibility, and market sizing in detail.

---

## Development Approach: 7-Agent Software Factory

Rather than the usual AI coding loop (prompt → generate → error → patch → repeat), I'm using a structured agent system that mirrors how real engineering teams work:

1. **Researcher** — maps codebase before any feature work (read-only)
2. **Story Writer** — turns ideas into user stories with acceptance criteria
3. **Spec Writer** — turns stories into technical briefs
4. **Backend Builder** — implements API routes and business logic
5. **Frontend Builder** — implements components and pages
6. **Test Verifier** — writes acceptance tests against the user story
7. **Validator** — compares implementation against approved story/brief

Three human checkpoints: story approval, brief approval, PR review.

Each agent gets one focused job with a clean context window. Mistakes get caught at the brief stage — not after 10 files have been changed.

---

## MVP Scope

The first release is intentionally focused:

- **Barcode scanner** — camera access, real-time barcode detection
- **Product search** — text search with autocomplete
- **Product card** — ingredients, nutrition, allergens, Health Star Rating, NOVA classification
- **Design system** — token-based component library built from scratch
- **PWA** — works offline, installs to home screen

Each feature runs through the full factory chain, with decisions documented as we go.

---

## Technology Choices

| Choice | Why |
|--------|-----|
| Next.js 15 (App Router) | Server components for API security, industry standard |
| TypeScript strict | Type safety across the full stack |
| Tailwind CSS | Utility-first, integrates with design tokens |
| PWA | No app store friction, offline-first for supermarket aisles |
| ZXing-js | Most mature JS barcode library (Apache 2.0) |
| Open Food Facts API | Free, open, 22,500+ AU products, growing |
| Vercel | Zero-config deployment for Next.js |

---

## What Comes After MVP

The long-term vision is an AI-powered food intelligence layer:

- **AI Product Hunter** — proactive research on behalf of users (find me healthy muesli bars under $1)
- **Continuous monitoring** — alert when favourited products reformulate
- **Budget-aware recommendations** — optimise for health within a weekly grocery budget
- **Community features** — reviews, discussions, recipe sharing, crowdsourced verification
- **B2B intelligence** — consumer demand gap reports sold to manufacturers and retailers
- **MCP server** — let any AI assistant query Australian food data through our platform

But first: ship the MVP. Prove the scanner works. Prove the product card is useful. Prove real people want this.

## Next Step

Phase 1: Establish the design system foundation (tokens, core components, IA) before building any features.
