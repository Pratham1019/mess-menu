# Refined hybrid prototype

**Current iteration:** responsive Hybrid. See [responsive/REVIEW.md](responsive/REVIEW.md) and [responsive/screenshots/](responsive/screenshots/) for the current mobile/tablet/desktop refinement. Earlier captures and reviews below remain historical evidence. Current capture command: `node scripts/capture-responsive.mjs` from `design-prototypes/`.

Owner-requested next iteration after neither earlier design was approved. Isolated visual prototype only; original Modern, Editorial and Daily Sheet remain available. No production ingestion, infrastructure or deployment.

## Open

- Automatic IST entry: <http://localhost:4322/hybrid/>
- Lunch: <http://localhost:4322/hybrid/lunch/>
- Dinner: <http://localhost:4322/hybrid/dinner/>
- Breakfast: <http://localhost:4322/hybrid/breakfast/>
- Snacks: <http://localhost:4322/hybrid/snacks/>
- Independent failure example: <http://localhost:4322/hybrid/lunch/?scenario=mixed>

Use the existing parent `design-prototypes/` Astro setup. `npm run check`, `npm run build`, `npm run preview` from that directory. Preview uses port 4322; `npx astro preview stop` stops the parent preview. Capture/verification: `node scripts/capture-hybrid.mjs` from the parent directory. Chromium was installed during earlier prototype work.

## Content and interaction

Frozen Thursday, 22 October 2026 research data, not live menus. Original item strings and order remain in the shared fixture and each dish's `data-original`; presentation changes case and comma spacing only. Long and compound entries remain single source entries. Only published Sindhi groups become category headings. No inferred mains, sides or desserts.

FC1/FC2 expose all four periods. Sindhi Menu 1 appears for Lunch and Dinner only, never as a missing Breakfast/Snacks source. Sunday closure is a product requirement; this fixed Thursday prototype does not invent other dates. Each source keeps its original retrieval time and date/rotation uncertainty. A mixed-state query explicitly simulates cached FC1 and unavailable FC2 while retaining Sindhi when eligible.

Shared native TypeScript handles selection, keyboard arrows/Home/End, URL/history and reset to start. Normal `/hybrid/` entry uses IST and the latest eligible serving end time: 09:30, 14:15, 18:00, 21:30, exclusive. After dinner, Breakfast is selected; the visible research date stays fixed rather than masquerading as tomorrow's live menu. Explicit meal links and manual choices override the automatic default. No timer interrupts reading. Without JavaScript, entry falls back to Lunch with ordinary links to all four meals.

## Visual system

Warm paper, deep ink and burgundy. Local Fraunces for branding/mess headings, IBM Plex Sans for dishes and utility text. Continuous ground, fine editorial dividers, compact segmented meal navigation. Every dish is its own full-width list row. No mobile food columns, paragraph runs, decorative food assets, gradients or large mess cards.

New code: `src/components/Hybrid.astro`, `src/styles/hybrid.css`, `src/pages/hybrid/`. Reuses the original source component, data and fonts. Shared interactions gain hybrid route/title support and a Hybrid-only responsive sticky-anchor offset. Earlier layouts keep their existing styling.

## Evidence scope

Screenshots are Chromium with Android touch emulation, DPR 2 and an 812px viewport height. Capture flow measures all four meals at 320/375/430, checks original entries/order and full-width rows, target dimensions, overflow, keyboard/history/reset/skip, no-JavaScript navigation, 200% computed text/line-height enlargement, independent failures, and nine IST entry boundaries. See `screenshots/verification.json` for the executed run and `review/` for independent assessments. This is not physical Android, TalkBack, student research or production performance certification.
