# Daily Sheet prototype

An isolated, local design prototype. The production application, live ingestion, Vercel adapter, persistent cache, credentials, and deployment are not part of this directory.

Direction A is approved for prototype exploration, with C's aligned section metadata. The final prototype is still awaiting the owner's approval.

## Run locally

From this directory:

    npm ci
    npm run build
    npm run preview

Open http://localhost:4321/lunch/ or http://localhost:4321/review/.

Astro's preview server stays available for the design review. Stop it with:

    npx astro preview stop

The default view is lunch; the real /lunch/ and /dinner/ links also work without JavaScript. A small native script enhances them with instant selection, URL/history updates, keyboard tab navigation, and return to the beginning. There is no client framework.

## Review states

| URL | State |
| --- | --- |
| /lunch/ | Complete lunch menus |
| /dinner/ | Complete dinner menus |
| /lunch/?scenario=mixed | Simulated FC1 cached-data warning, FC2 missing menu, Sindhi still available |
| /review/ | Separate review launcher; not part of the proposed product flow |

The simulated failure state persists when switching meals. Its label is explicit. It does not claim the real sources are failing.

The prototype is fixed to Thursday 22 October 2026. It must not be used as a live menu service. Source text and spelling are preserved, including FC1's uppercase names and compound entries. No “mains/sides” categories are invented for FC1 or FC2.

## Data and source provenance

- FC1: Thursday entry extracted from the archived literal in ../research/evidence/fc1-menu-literal.txt. Its raw date omits a year; the prototype says so.
- FC2: ../research/evidence/fc2-menu-2026-10-22.json.
- Sindhi: **Menu 1**, explicitly selected by the owner after the first research phase. Verified against https://sindhi.coolstuff.work/menu1.json and archived in ../research/evidence/sindhi-rotation-menu1.json. MENU1_SOURCE.json records the actual request time and headers. This manual selection is not a claim that the automatic rotation chose Menu 1 that day.
- Sindhi's raw categories are rendered using the source builder's delimiter/order conventions. Menu 1's Thursday dinner is Gobi Manchurian, Matar Paneer masala, Dal, Rice, Chapati, and Suji halwa.
- “Checked” timestamps describe the corresponding research retrievals. They are not manual verification of what the mess served.
- Sindhi has no breakfast/snacks or Sunday service, per the owner's clarification. This fixed Thursday prototype has only lunch/dinner and no day-navigation feature.

The source-data copy was a one-time research operation. No extraction/fetching pipeline runs inside this prototype.

## Browser captures and verification

Install the matching Playwright Chromium once:

    npx playwright install chromium

With the preview running:

    npm run check
    npm run build
    npm run verify

The capture script uses Playwright with Chromium, an Android user agent, touch input, DPR 2, and an 812px CSS viewport height. It captures complete lunch and dinner pages at 320, 375, and 430px; first viewports at 375px; and a mixed-failure example. PNG pixel dimensions are twice the CSS dimensions.

The script checks source item preservation, source order, meal switching from the bottom, sticky control access, keyboard selection, browser Back, independent failure states, no horizontal/nested scrolling, 200% text reflow, no-JavaScript navigation, console errors, and absence of external data/font requests. These are local Chromium checks, not physical-Android user testing or a cross-browser certification.

Round-one images are development evidence, ignored by Git. Final evidence and measurements are in screenshots/; the concise outcome is in REVIEW.md after review.

## Design and assets

Astro with strict TypeScript, Tailwind CSS v4 through its Vite plugin, static research fixtures, and one local 45.7kB Latin IBM Plex Sans font asset. FONT_SOURCES.json records its source URL and used weights; public/fonts/OFL.txt contains its license.

BRIEF.md is the prototype's scoped design contract. DESIGN.md will document the reviewed prototype's actual tokens, with explicit pending production approval. No production DESIGN.md has been approved by this work.

