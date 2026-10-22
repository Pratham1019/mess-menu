# Assessment A — round 2 verdict

Method: fresh, independent Impeccable design verdict pass on Assessment A round 1's two findings. This is a scoped fix verification, not a new holistic critique, dual-assessment synthesis, or production certification. No detector was run or detector findings inspected.

**Disposition: SHIP at isolated local prototype scope.** Both original issues are resolved. No further fix or recapture is required for those findings. This accepts the prototype for its review purpose; it does not authorize production implementation or deployment.

## Original issue scores

| Original issue | Score | Evidence |
|---|---|---|
| Mandatory: keyboard skip target hides FC1 heading/year note beneath the sticky meal bar | **Resolved** | `src/styles/global.css:54` now gives `#comparison` a 78px scroll margin. Native keyboard Tab → Enter activation was exercised separately on normal lunch, normal dinner, mixed lunch, and mixed dinner in a fresh 375×812 T3 browser tab. Each activation focused `main#comparison`; its heading and year note cleared the sticky bar. Live screenshots of all four landings visually confirmed the measurements below. |
| Optional: duplicate FC2 missing-state source links | **Resolved** | `src/components/MenuSection.astro` removes the inline recovery anchor and retains the single footer Source link, accessibly named “View FC2 source (opens in a new tab)”. Both live mixed meal states contained exactly one FC2 link to `https://tikmit.com/`. The replacement mixed capture shows the same result. |

Paths in the table are relative to `prototype/`.

## Keyboard landing evidence

One new tab was created with `preview_open(reuseExistingTab:false)` after `preview_status`, then resized to 375×812. Every subsequent browser call targeted its returned tab ID. Each route was loaded without a fragment; Tab focused “Skip to menus” at scrollY 0, and Enter activated it. No click, scripted focus, or scripted scroll substituted for keyboard activation.

| Route before activation | Resulting focus | ScrollY | Main top | FC1 heading | FC1 year note |
|---|---|---:|---:|---:|---:|
| `/lunch/` | `comparison` | 128.5 | 78.16 | 94.16–125.35 | 128.35–148.65 |
| `/dinner/` | `comparison` | 128.5 | 78.16 | 94.16–125.35 | 128.35–148.65 |
| `/lunch/?scenario=mixed` | `comparison` | 156.5 | 78.16 | 94.16–125.35 | 128.35–148.65 |
| `/dinner/?scenario=mixed` | `comparison` | 156.5 | 78.16 | 94.16–125.35 | 128.35–148.65 |

Positions are viewport CSS pixels, rounded to two decimals. The sticky bar occupied y=0–62 in every case. In both mixed states the saved-menu warning was also fully below it at y=158.65–222.65. Each resulting URL ended in `#comparison`.

## Recovery copy and evidence validity

Current source and both live mixed states show “Source unavailable”, “Menu unavailable”, “FC2 could not be reached. Check the source or try again later.”, and “No saved menu”. The published-schedule note and FC2 dish list are hidden in that scenario. The remaining footer link provides the named recovery destination without repetition. FC1 retains its year uncertainty, saved food and warning; Sindhi remains open. The scenario is explicitly labelled simulated.

Visually opened every final supplied capture under `prototype/screenshots/`: lunch and dinner full-page images at **320, 375 and 430px**, plus `lunch-viewport-375.png`, `mixed-full-375.png`, `mixed-viewport-375.png`, and `sticky-375.png`. These are the replacement root-level captures, not the round-1 archive. Also read `verification.json` for their recorded Chromium 156, Android touch emulation, DPR2, 812px viewport, font-loaded and document-top capture conditions.

The full-page captures include the masthead through the footer, with FC1 → FC2 → Sindhi open in stable order. Full-width dish text, warm paper/ink, editorial header alignment, and Sindhi Menu 1 remain intact. Long entries are visibly complete across the supplied widths. The normal first viewport shows all FC1 food and the beginning of FC2; the mixed first viewport correctly spends more space on simulation/saved-menu context. The mixed full capture contains the revised FC2 copy and single Source link. The sticky capture is intentionally scrolled. Captures are usable for this verdict; no evidence mismatch requiring recapture was established. The 78px fragment offset itself is verified by live keyboard landings, not inferred from document-top images.

## Actual limits

Read AGENTS.md, PRODUCT.md, DESIGN_BRIEF.md, prototype/BRIEF.md, the Impeccable skill/craft floor, the original assessment, and the named components, stylesheet and interactions. The supplied approved brief governed this review; no new direction interview was needed. No new defect hunt or heuristic rescore was performed. Other assertions in `verification.json` were read as supplied evidence, not rerun or independently certified here.

Live checks used Chromium at mobile CSS dimensions; this pass did not repeat Android touch emulation or test a physical phone, TalkBack, desktop, enlarged text, offline/no-JavaScript behavior, ingestion, real source freshness, external recovery navigation, or every interaction. No tests/build were run. No source, production, ingestion, infrastructure or screenshot files were edited; no install, server start/stop, or deployment was performed. The sole written deliverable is this report.

Questions skipped: this delegated verdict returns resolution status for the existing findings; no unresolved objection needs user input.
