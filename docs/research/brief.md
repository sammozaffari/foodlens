# FoodLens Research Brief

## Problem Statement

Australia is the "allergy capital of the world" with over 5 million people living with allergic disease, yet no commercially viable food transparency app exists that combines ingredient analysis, macro tracking, allergen detection, and community features for the Australian market.

The $148 billion Australian grocery market is served by fragmented tools. Yuka's 80M users get European-centric scoring that ignores Health Star Ratings. FoodSwitch was purpose-built for Australia but suffers from severe database gaps (33% recognition rate). MyFitnessPal's 2025 update triggered user revolt (1.5-star rating). Not a single platform offers community features like reviews, ingredient discussions, or recipe sharing.

## Competitive Landscape

### Tier 1 -- Direct Food Scanning

| Platform | Users | AU Coverage | Key Gap |
|----------|-------|-------------|---------|
| Yuka | 80M+ | Most non-perishables | EU-centric, allergens paywalled, no HSR |
| Open Food Facts | 4M+ products | ~22,500 AU (30-50%) | Unpolished UX, no personalisation |
| FoodSwitch | Research-focused | 33% recognition | Poor UX, no public API |
| Trash Panda | US-focused | Zero | Photo-scanning worth emulating |

### Key Gaps No Platform Covers

- Comprehensive verified AU product database
- Open Health Star Rating data
- Evidence-based dose-aware AU additive analysis
- AU-specific allergen rules with "may contain" filtering
- Combined ingredient transparency + macro tracking
- Community features (reviews, discussions, recipes)

## User Pain Points

- MyFitnessPal: 1.5-star rating, paywalled scanning ($49.99/yr), 3-5s lag
- Only 37% of AU products display Health Star Ratings
- 41% of "healthy" claims violate nutrient profiling
- No allergen scanning app covers AU products adequately
- 1 in 70 Australians have coeliac (~367,000, 80% undiagnosed)

## Technical Foundation

| Source | Content | Cost | AU Coverage |
|--------|---------|------|-------------|
| Open Food Facts | 4M+ products, Nutri-Score, NOVA | Free (ODbL) | ~22,500 |
| FatSecret | 2.3M+ foods, AU dataset | Free (<$1M rev) | Good |

PWA architecture with ZXing-js barcode scanning. Native Barcode Detection API on Android, JS polyfill for iOS.

## Market Opportunity

- AU grocery: $148.3B (2025) growing to $251B by 2035
- 5M+ Australians with allergic disease
- 85% smartphone penetration, 73% maintain healthy diet
- Regulatory tailwinds: mandatory HSR in preparation, PEAL allergen labelling effective Feb 2026
