# Competitor UX Patterns — What to Steal, What to Avoid

## Per-Platform Analysis

### Yuka
- **Score display:** 0-100 numeric score + color-coded circle (green/orange/red) + label (Excellent/Good/Poor/Bad)
- **Issue flagging:** Icon-based callouts ("6 additives", "Too sweet", "Too caloric")
- **Steal:** The speed of the scan → result flow ("blink of an eye"). The at-a-glance clarity of the traffic light system.
- **Avoid:** The binary good/bad judgement. Dietitians hate it. The 10% organic bonus has no scientific basis. Fear-mongering approach.

### Trash Panda
- **Core flow:** Scan → Swap → Feel Better (three-step mental model)
- **Ingredient display:** Flags by category (artificial dyes, seed oils, allergens, ultra-processed) with links to peer-reviewed research for each flag
- **Typography:** Manrope (body), Fraunces (headlines), IBM Plex Mono (technical) — distinctive three-font system
- **Scan methods:** Barcode scan, photo of ingredient list, text search — three entry points
- **Steal:** The transparency-over-gamification approach. Personal preference filters so you only see what matters to YOU. The multi-modal scanning (barcode + photo + search). The three-font typographic system.
- **Avoid:** US-only coverage. Premium paywall for basic allergen features.

### Open Food Facts
- **Multi-score display:** Nutri-Score (A-E letters), NOVA (1-4 processing level), Eco-Score (A-E environmental), all with color-coded badges
- **Ingredient detail:** Full ingredient list with confidence percentages, nutrient-level indicators ("Salt in low quantity" with grade)
- **Community:** Contributor system, teams, data source transparency, gamified contribution ("Hunger Games" validation)
- **Steal:** The multi-dimensional scoring (nutrition + processing + environment shown together). The community contribution model with photo-first workflows. The transparency about data sources.
- **Avoid:** The cluttered, unpolished UX. Too much data density for a consumer app.

### Clearya
- **Alert model:** Flags specific chemicals by hazard category (cancer, infertility, developmental harm, hormonal, EU-banned) rather than a single score
- **Multi-modal input:** Browser extension, mobile photo/video capture, copy-paste ingredient lists
- **Data sources:** Citations from multiple regulatory bodies (EU, California EPA, WHO)
- **Steal:** The hazard-category approach (not one number, but specific concerns). The regulatory citation model — say WHERE the data comes from. Copy-paste ingredient analysis is clever for web use.
- **Avoid:** No food coverage. Browser extension model doesn't work for supermarket aisles.

### Fri For App
- **Allergen priority:** Users select their allergens, and those appear FIRST in results — not buried in a list
- **Nutrition recalculation:** Shows per-package instead of per-100g — matches how people actually eat
- **Scanner UX:** Flashlight toggle for dark supermarket shelves. Fast scan completion.
- **NOVA + hyper-palatability:** Goes beyond allergens to flag ultra-processing and addictive food design
- **Steal:** Allergen prioritisation (your allergens surface first). Per-package nutrition (real-world serving). Flashlight toggle. The hyper-palatability flagging is a differentiator nobody else does.
- **Avoid:** Norwegian-only. Subscription-only model.

### SkinSafe (Mayo Clinic)
- **Badge system:** 22+ distinct safety markers in three categories (safety concern, allergen, free-from)
- **"Safe for Me" codes:** Clinicians generate personalised codes → patients enter them → automatic product filtering based on their specific allergies. Brilliant.
- **UX patterns:** Carousel navigation for badges, toggle on/off per filter, confirmation modals for destructive actions
- **Steal:** The "Safe for Me" concept is the single best feature across all competitors. Imagine a dietitian generating a code for a coeliac patient that filters every product in the database. This is HUGELY transferable to food.
- **Avoid:** Skincare only. The badge overload (22+ is too many categories).

### Examine.com
- **Evidence framework:** GRADE system (High/Moderate/Low/Very Low certainty) — doesn't collapse to binary
- **Trust model:** 100% subscription-funded, zero advertising, zero brand influence. 5-star Trustpilot average.
- **Steal:** The GRADE evidence approach for ingredient safety claims. Show the quality of the evidence, not just the conclusion. The independence-as-product model.
- **Avoid:** Academic density — too much for a scanner app's instant results.

---

## Synthesis: FoodLens UX Recommendations

### Product Scanning Flow
**Model: Trash Panda's three-entry-point approach + Fri For's speed**
1. Primary: Barcode scan (camera, fast, flashlight toggle)
2. Secondary: Photo of ingredient label (OCR extraction)
3. Tertiary: Text search / manual barcode entry

### Product Card — Information Hierarchy
**Model: Layered disclosure (summary → detail on demand)**

**Layer 1 — Glance (2 seconds):**
- Product image + name + brand
- Three visual scores side by side: Nutrition (HSR), Processing (NOVA), Ingredients
- Personal allergen alerts (red badges, YOUR allergens only — Fri For's priority model)
- One-line verdict (not binary — more like "3 concerns for your profile")

**Layer 2 — Scan (10 seconds):**
- Ingredient list with flagged items highlighted by concern category (Clearya's approach)
- Nutrition panel with per-serve AND per-100g (Fri For's real-world serving)
- Allergen summary (bolded per PEAL 2026 requirements)
- "Similar but better" alternative suggestion

**Layer 3 — Deep dive (on demand):**
- Each flagged ingredient expandable: what it is, why flagged, evidence quality (Examine's GRADE), regulatory status (AU vs EU vs US)
- Full nutrition breakdown with daily % values
- Community reviews and notes (SkinSort model)
- Data source citations

### Scoring Display
**Model: Multi-dimensional, NOT a single number**

Yuka's single 0-100 score is the most successful consumer pattern, but dietitians hate it for good reason. Open Food Facts shows that multiple scores work visually.

**FoodLens approach: Three small badges in a row**
- 🟢🟡🔴 **Nutrition** (based on HSR algorithm, A-E or star display)
- 🟢🟡🔴 **Processing** (NOVA 1-4, with plain language: "Minimally processed" / "Ultra-processed")
- 🟢🟡🔴 **Ingredients** (additive concern level, based on evidence not fear)

No single composite score. Let the user weight what matters to them.

### Allergen System
**Model: SkinSafe's "Safe for Me" + Fri For's prioritisation**
- User sets allergen profile once (gluten, dairy, nuts, etc.)
- Every product scan instantly shows: SAFE ✓ or ALERT with specific allergens found
- Allergen alerts appear FIRST, before any other information
- "May contain" traces shown separately from declared ingredients
- Future: dietitian-generated personalisation codes (SkinSafe's killer feature)

### Trust & Evidence Display
**Model: Examine's GRADE framework, simplified**
- When we flag an ingredient, show WHY with evidence quality
- "IARC Group 2A" doesn't mean much to consumers → translate to plain language
- "Strong evidence of harm at typical consumption levels" vs "Weak evidence, may be fine in small amounts"
- Always cite the source (FSANZ, EFSA, IARC, peer-reviewed study)
- Never binary. Always contextual. Dose matters.

### Community Features (Phase 2+)
**Model: SkinSort's community + Open Food Facts' contribution**
- Product reviews with dietary context ("I'm coeliac, this is genuinely safe")
- Photo-first product contributions (Open Food Facts' model)
- Gamified verification (Hunger Games-style)
- Recipe sharing filtered by dietary profile
- "Is this safe?" quick-ask for newly diagnosed conditions
- Product reformulation alerts from community spotting

### Visual Design Principles (from competitors)
**Steal from Trash Panda:** Three-font typographic system. Empowerment messaging, not shame.
**Steal from Yuka:** Clean, scannable product cards. Speed of visual comprehension.
**Steal from Clearya:** Hazard categories, not single scores. Regulatory citations.
**Steal from SkinSafe:** Badge/toggle filtering system. Personalisation through codes.
**Steal from Open Food Facts:** Multi-score badges (nutrition + processing + environment).
**Steal from Examine:** Evidence quality indicators. Independence as trust signal.

**Avoid from everyone:** Binary good/bad. Fear-mongering. Oversimplified single scores. Cluttered data dumps. Paywalling basic safety features.
