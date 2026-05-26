# Build Log 00: Project Genesis

**Date:** 2026-05-26
**Phase:** Pre-development

---

## How This Project Was Born

FoodLens started not from a product idea, but from a systematic analysis of what employers want.

### Step 1: Built a Job Intelligence System (Scout)

Before deciding what to build, we built a tool to understand the market. Scout scrapes LinkedIn daily for UX/product/service/experience design jobs in Sydney, scores them for AI relevance, and analyses the full corpus for patterns.

**What Scout found across 66 active Sydney JDs:**
- 77% mention stakeholder management
- 64% mention information architecture
- 62% mention AI/ML
- 38% mention design systems
- 36% mention service design
- 33% of roles now expect AI fluency
- Financial services dominates (61% of roles)
- "End to end" appears 56 times -- employers want full-lifecycle designers

### Step 2: Gap Analysis Against My Portfolio

Scout diffed the corpus against my existing portfolio, CV, and LinkedIn profile.

**The finding: I have a labeling problem AND a content gap.**

My two case studies prove deep research and service design capability. But they don't demonstrate:
- Product design (0→1 product thinking) -- 32 JDs ask for this
- Information architecture -- 64 JDs, most demanded skill
- Design systems -- 38% of roles
- Interaction design -- 15 JDs
- Coded prototypes -- strong market signal

**The recommendation:** Build a self-directed product project that demonstrates the full UX process from research through shipped code.

### Step 3: Choosing the Project

We evaluated three directions:
1. A design system / component library for AI interfaces
2. A 0→1 SaaS product (full UX process)
3. A small public utility tool

**Decision: Option B** -- a full product build documents every skill employers want to see. The build process itself becomes the case study.

### Step 4: Why Food Transparency

I'd already done extensive research into the Australian food transparency space and identified a genuine market gap:
- Australia is the allergy capital of the world (5M+ people)
- No app combines ingredient analysis + allergen detection + macro tracking for AU
- The $148B grocery market is served by fragmented, failing tools
- Regulatory tailwinds (mandatory HSR, PEAL allergen labelling)

The research brief (see `docs/research/brief.md`) covers the full competitive landscape, user pain points, technical feasibility, and market opportunity.

### Step 5: Adopting the 7-Agent Software Factory

Instead of vibe-coding, we adopted a structured development process:

1. **Researcher** -- maps codebase before any feature work (read-only)
2. **Story Writer** -- turns ideas into user stories with acceptance criteria
3. **Spec Writer** -- turns stories into technical briefs
4. **Backend Builder** -- implements API routes and business logic
5. **Frontend Builder** -- implements components and pages
6. **Test Verifier** -- writes acceptance tests against the user story
7. **Validator** -- compares implementation against approved story/brief

Three human checkpoints: story approval, brief approval, PR review.

This process itself demonstrates how a designer uses AI agents to ship production code -- a direct answer to the "AI fluency" that 33% of Sydney employers now expect.

### Step 6: MVP Scope

We scoped the MVP to be buildable in a focused sprint while demonstrating all the portfolio gaps:

- **Barcode scanner** (camera UX, interaction design)
- **Product search** (IA, search patterns)
- **Product card** (visual design, data display, allergen flagging)
- **Design system** (tokens, component library)
- **PWA** (offline capability, install prompt)

Each feature runs through the full 7-agent factory chain, with the build log documenting every decision.

---

## What This Case Study Will Show

| Employer Need | How FoodLens Demonstrates It |
|---------------|------------------------------|
| Product design (32 JDs) | Full 0→1 product with documented decisions |
| Information architecture (64 JDs) | Sitemap, content model, data architecture |
| Interaction design (15 JDs) | Camera scanning UX, search, card interactions |
| Design systems (38%) | Token-based component library, documented |
| AI/ML capability (62 JDs) | 7-agent factory build process |
| Experimentation (13 JDs) | Design decisions with rationale |
| Coded prototypes (market signal) | Shipped, deployed, working product |
| Accessibility (27%) | WCAG 2.1 AA throughout |

---

## Technology Choices

| Choice | Rationale |
|--------|-----------|
| Next.js 15 (App Router) | Industry standard, server components, API routes |
| TypeScript strict | Type safety, shows engineering rigour |
| Tailwind CSS | Utility-first, design token integration |
| PWA | No app store friction, offline capability |
| ZXing-js | Most mature JS barcode library, Apache 2.0 |
| Open Food Facts API | Free, open, 22,500+ AU products |
| Vercel | Zero-config Next.js deployment |

## Next Step

Phase 1: Establish the design system foundation (tokens, core components, IA documentation) before building any features.
