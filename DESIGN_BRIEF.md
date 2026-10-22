# Design Brief

## Design Intent
Create a clean, bold, exceptionally polished
mobile-first utility.

The interface should feel like a thoughtfully
designed independent digital publication,
combined with the speed and precision of
an excellent native utility.

## Visual Direction
Contemporary mobile utility with editorial sophistication. Minimalism must feel deliberately designed, not like an unstyled document.

Keywords:
- Bold
- Precise
- Restrained
- Typographic
- Functional
- Distinctive
- Effortless

## Priorities
1. Menu readability.
2. Information hierarchy.
3. Mobile usability.
4. Visual craftsmanship.
5. Performance.
6. Desktop adaptation.

## Typography
- Strong, expressive headings.
- Extremely readable dish names.
- Clear distinction between messes and categories.
- Limited type sizes and weights.
- No unnecessary uppercase text.
- Avoid defaulting to Inter.

Consider IBM Plex Sans, Geist, or another
deliberately chosen typeface.

## Layout
- Design at 375px first.
- Menus must dominate the screen.
- Compact but comfortable information density.
- Strong alignment and consistent spacing.
- Prefer coherent shared surfaces and dividers over repetitive card containers.
- Selective rounding, subtle surface differentiation and restrained shadows are permitted when functional.
- No horizontal carousel hiding menus.
- No unnecessary navigation.
- At 1024px+, use three mess comparison columns for Lunch/Dinner and two balanced columns for Breakfast/Snacks, within an approximately 1100–1200px maximum width.
- At 600–1023px, provide a balanced intermediate layout. Mobile 320–599px keeps messes vertically stacked.

## Color
- Primarily neutral.
- Strong text/background contrast.
- One purposeful accent color.
- No decorative gradients.
- Avoid excessive colored surfaces.

Exact colors must be decided during
design exploration, not prematurely fixed.

## Interactions
- One compact shared four-option selector: Breakfast, Lunch, Snacks, Dinner.
- All four options remain visible at 320px; use accessible touch targets.
- Select the current/upcoming meal on entry using IST and the latest eligible serving end time. After Dinner, default to the next day’s Breakfast.
- Explicit meal links/manual choices take precedence; do not change meals while someone is reading.
- Sticky meal switching returns to the beginning of the comparison.
- Show FC1 and FC2 for Breakfast/Snacks; add Sindhi for Lunch/Dinner.
- Do not show unsupported Sindhi meals as failed or missing sources.
- Minimize taps and scrolling.
- Touch-friendly controls.
- Fast, subtle feedback.
- No gratuitous motion.

## Anti-Patterns
Never introduce:
- Generic SaaS dashboards.
- Card soup.
- Oversized marketing hero sections.
- Decorative food illustrations.
- Unnecessary shadows or glow.
- Pill badges everywhere.
- Gratuitous rounded rectangles.
- Fake statistics.
- Excessive whitespace.
- Complex navigation.
- Feature bloat.

## Design Exploration
Current owner request: neither prior prototype is approved as-is. Build one refined hybrid in `design-prototypes/hybrid/` and `/hybrid/`: warm paper, deep ink, restrained burgundy, expressive serif branding/mess headings, polished four-option utility controls and compact provenance. Keep prior explorations for comparison. No production ingestion or deployment.

Hybrid dishes must be individual full-width lines with natural wrapping. No dot-separated menu paragraphs, multi-column mobile dish layouts, invented categories or large mess cards. Retain only source-provided groups. Keep eligible messes open in stable order. Capture full-page and first-viewport at 375px; verify 320px and 430px.

For each, provide:
- Visual identity.
- Typography.
- Palette.
- Mobile layout.
- Menu hierarchy.
- Advantages and compromises.

Recommend one, then wait for approval.

## Verification
Use actual mobile screenshots.
Evaluate at 320px, 375px, and 430px.

Check:
- First-screen information density.
- Readability.
- Visual hierarchy.
- Scrolling effort.
- Touch usability.
- Alignment.
- Consistency.
- Overall visual quality.

Use Impeccable where available.

## Final Principle
Every element must earn its place.

The best interface is not the one with
the most features or visual effects.
It is the one that makes reading and
comparing menus feel effortless.


## Current responsive refinement
Refine the existing hybrid rather than replace its world. Improve row rhythm, serving-time hierarchy and restrained metadata. Full-width individual dishes remain within each mess; source categories only. Compose the desktop toolbar and source columns intentionally. Required captures: full page and first viewport at both 375px mobile and 1440px desktop. No production ingestion or deployment.
