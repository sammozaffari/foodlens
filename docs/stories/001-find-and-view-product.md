# Story 001: Find and View a Product

## Status: DRAFT -- Awaiting Approval

---

## User Story

As a health-conscious shopper, I want to find a food product by scanning its barcode or searching by name and then see a clear breakdown of its ingredients, nutrition, allergens, and health scores, so that I can make an informed decision in the time it takes to stand in a supermarket aisle.

---

## Acceptance Criteria

### Part A: Barcode Scanner

1. The app provides a "Scan" entry point accessible from the home screen in one tap.
2. Tapping "Scan" opens a full-screen camera viewfinder with a visible scan region indicator.
3. The scanner reads EAN-13 and EAN-8 barcode formats (the formats used on Australian grocery products).
4. When a valid barcode is detected, the camera stops scanning and the user is taken to the product card (Part C) within 2 seconds of detection.
5. A flashlight toggle is visible on the scanner screen so the user can illuminate products on dark shelves.
6. If the user has not yet granted camera permission, the app displays a plain-language explanation of why camera access is needed before triggering the browser permission prompt.
7. If the user denies camera permission, the app displays a message explaining that scanning requires camera access and offers the text search (Part B) as an alternative. The message includes instructions for re-enabling camera access in device settings.
8. If the device has no camera (e.g., desktop browser), the "Scan" entry point is either hidden or replaced with a prompt to use text search instead.
9. The scanner can be dismissed at any time via a close/back button, returning the user to their previous screen.
10. A manual barcode entry option is available on the scanner screen: a text field where the user can type a barcode number directly. This serves as a fallback when the camera cannot read a damaged or printed barcode.

### Part B: Product Search

11. The app provides a "Search" entry point accessible from the home screen, equally prominent to the "Scan" entry point.
12. The search accepts free-text input: product names, brand names, or partial terms (e.g., "Vegemite", "oat milk", "Sanitarium").
13. As the user types, results appear below the search field. Results update after the user pauses typing (debounced), not on every keystroke.
14. Each search result row shows: product name, brand name, and product image (if available). If no image is available, a generic placeholder is shown.
15. Search results are ordered by relevance to the query.
16. Tapping a search result takes the user to the product card (Part C).
17. If the search returns no results, the app displays a message: "No products found. Try a different search term or scan the barcode."
18. If the search field is empty, the search screen shows recent searches (if any exist in the current session) or a prompt encouraging the user to search or scan.
19. The search field is auto-focused on desktop so users can begin typing immediately.
20. The search works on all form factors: mobile, tablet, and desktop.

### Part C: Product Card

#### Layer 1 -- Glance (the user understands the product in under 2 seconds)

21. The product card displays the product name, brand name, and product image at the top.
22. Below the product identity, three score badges are displayed in a horizontal row:
    - **Nutrition** -- based on Nutri-Score or Health Star Rating, displayed as a letter grade (A-E) or star rating with a colour indicator (green/amber/red).
    - **Processing** -- based on NOVA classification (1-4), displayed with a plain-language label (e.g., "Minimally processed", "Ultra-processed") and colour indicator.
    - **Ingredients** -- an overall ingredient concern level with a colour indicator.
23. Each score badge uses the design system's semantic colours: success (green) for good, warning (amber) for moderate concern, error (red) for high concern.
24. If the product has allergens listed, allergen alert badges appear prominently below the scores. Allergens are displayed using bold text per PEAL 2026 labelling requirements. "May contain" traces are shown separately from declared allergens.

#### Layer 2 -- Scan (the user gets meaningful detail within 10 seconds)

25. Below the glance layer, the full ingredient list is displayed. Ingredients flagged as concerning are visually highlighted (distinct from unflagged ingredients) with a brief reason for the flag.
26. A nutrition panel shows key nutrients with values displayed per serving AND per 100g. Numerical values use the mono typeface for readability.
27. An allergen summary section lists all identified allergens with declared allergens and "may contain" traces visually distinguished.

#### Layer 3 -- Deep Dive (on demand, not shown by default)

28. Each flagged ingredient is expandable: tapping it reveals what the ingredient is, why it was flagged, and the source of the claim (e.g., FSANZ, EFSA).
29. A full nutrition breakdown is available on demand, showing all nutrients with daily percentage values where applicable.
30. Data source attribution is visible on the product card (e.g., "Data from Open Food Facts").

### Part D: Data and Error Handling

31. If a scanned or searched barcode is not found in the data source, the app displays: "We don't have this product yet" with a clear message. No blank screen, no spinner that never resolves.
32. If the data source returns a product with incomplete data (e.g., missing nutrition info, missing image, missing scores), the app displays what is available and shows "Data not available" for missing fields rather than hiding them or showing broken UI.
33. If a score cannot be calculated due to missing data, the score badge displays "N/A" or "No data" instead of a misleading value.
34. If the network request fails (timeout, offline, server error), the app displays a user-friendly error message with a "Try again" action. The error message does not expose technical details.
35. If the network is slow (response takes longer than 1 second), a loading skeleton or spinner is shown so the user knows the app is working.

---

## Edge Cases

- **Barcode scanned but product exists with zero nutrition data:** Show the product name and image, display "Nutrition data not available" for scores and panel. Do not show empty badges or zero values.
- **Multiple products match the same barcode:** Display the most recently updated record. (If this is not possible with the data source, flag as an open question.)
- **User scans a non-food barcode (book, household item):** If the data source returns a result, show it. If not, show the "product not found" state. Do not attempt to filter by product category.
- **Search query returns hundreds of results:** Paginate or lazy-load results. Do not attempt to render all results at once.
- **User rapidly scans multiple barcodes:** Each new scan replaces the previous one. No queuing or multi-scan behaviour.
- **Camera viewfinder on landscape orientation:** The scanner should remain usable if the user rotates their device.
- **User navigates back from product card:** They return to the scanner or search screen in the state they left it (search query preserved, scanner ready to scan again).
- **Product name or brand name is extremely long:** Truncate with ellipsis rather than breaking layout.
- **Product image fails to load:** Show the placeholder image. Do not show a broken image icon.

---

## Out of Scope

- User profiles or accounts
- Saved/favourite products
- Personalised allergen preferences (user-configured allergen profile)
- Product comparison
- Alternative product suggestions ("Similar but better")
- Community features (reviews, ratings, contributions)
- Shopping lists or meal planning
- Offline mode / caching of previously viewed products
- Photo-based ingredient list scanning (OCR)
- Sharing a product card

---

## Open Questions

1. **Health Star Rating vs. Nutri-Score:** The brief mentions both HSR and Nutri-Score for the nutrition badge. Which system does FoodLens use as the primary display? Or does it depend on which data is available for the product?
2. **Ingredient concern scoring:** What methodology determines the "Ingredients" badge score (the third badge)? Is this based on additive count, additive risk classification, or another system?
3. **Allergen taxonomy:** What is the definitive list of allergens FoodLens will flag? The PEAL 2026 list covers the mandated set, but should the app flag additional allergens beyond the regulatory minimum?
4. **Search data source:** Does text search query Open Food Facts only, or also FatSecret? If both, how are duplicate products handled?
5. **Manual barcode entry validation:** Should the manual barcode field validate the format before querying (e.g., check EAN-13 checksum), or just send whatever the user types?
