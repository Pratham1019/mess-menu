# Two mobile menu design prototypes

Isolated Astro + strict TypeScript + Tailwind CSS v4 exploration. This folder is separate from the original `prototype/`; there is no production app, ingestion, infrastructure or deployment.

## Local use

```sh
cd design-prototypes
npm ci
npm run check
npm run build
npm run preview
```

Open <http://localhost:4322/>. Automatic entries: `/modern/` and `/editorial/`; they choose the current/upcoming meal using IST. Explicit `/modern/lunch/` and `/editorial/lunch/` links keep that chosen meal. Both have `/breakfast/`, `/snacks/`, and `/dinner/` routes. Add `?scenario=mixed` to simulate cached FC1 and unavailable FC2 while other eligible sources remain available. These failures are explicitly illustrative; they are not current upstream observations.

Astro 7 preview runs a background server. Stop from this directory with `npx astro preview stop`. The original Daily Sheet preview on port 4321 is separate.

## Content and honesty

Frozen research snapshot: Thursday 22 October 2026, not a live menu. Full original item strings are retained in `src/data/menu-snapshot.json` and each rendered dish's `data-original`. Case, comma spacing and trailing commas are normalized for readability; spelling, composite entries, quantities and source order remain intact. No inferred mains, staples, desserts or dietary categories are introduced. Sindhi's published groups alone supply group labels.

FC1 and FC2 Breakfast/Snacks come directly from existing research/evidence/fc1-menu-literal.txt and fc2-menu-2026-10-22.json. Lunch/Dinner use the original research fixtures. Sindhi uses owner-selected Menu 1, not an automatic claim about the current rotation. Its original capture is research/evidence/sindhi-rotation-menu1.json. See RESEARCH.md for source uncertainties and retrieval windows. FC1 source dates lack a year; schedules are not independent confirmation of service.

The supported-meal rule is independent of retrieval state: Breakfast/Snacks expose only FC1/FC2, Lunch/Dinner include Sindhi. Owner-confirmed Sunday closure remains a production requirement; this prototype intentionally has one fixed Thursday and no date picker.

## Design boundaries

Each route family has its own scoped palette, layout, navigation treatment and CSS. Data, semantic source components and native interaction code are shared to keep comparison fair. Both render all meal panels as HTML with ordinary fallback links, then use a small native script for switching, arrow keys and history. No frontend framework or live source fetches. The one continuous modern surface is not three repeated cards. The editorial layout uses true source groups, not invented menu taxonomy.

Fonts are served locally. Geist and Fraunces provenance is in FONT_SOURCES.json; their OFL licenses and IBM Plex license ship with the files. The IBM Plex file matches the original prototype's researched local font.

## Verification

```sh
npm run verify
```

Playwright requires the Chromium installed during the earlier prototype work. If this is a fresh machine, run `npx playwright install chromium` first. The capture flow runs Chromium with Android user agent/touch emulation, 812px viewport height and DPR 2. It measures all four meals at 320/375/430, saves full-page captures for each meal at375 plus lunch at320/430, first viewport at375, and explicit mixed states. See screenshots/verification.json for executed assertions; the script exits on failures.

This is browser emulation, not physical Android, TalkBack, real students or production performance certification. Design tokens and review findings are prototype-scoped and await owner approval.

## Automatic entry selection

The automatic entry renders existing meal HTML and selects in the browser using `Asia/Kolkata`; it makes no source request or extra page navigation. Cutoffs derive from the frozen Thursday source serving times: Breakfast until 09:30, Lunch until 14:15, Snacks until 18:00, Dinner until 21:30. End times are exclusive. Between periods, the next period is shown; after Dinner, Breakfast is next. The URL is replaced with the chosen explicit meal so Back and sharing remain predictable. Manual links remain explicit, and no timer changes the meal while reading. JavaScript-disabled entry falls back to Lunch with all four native meal links available.

These prototypes still display the clearly labelled 22 October research snapshot, including after Dinner; they do not fetch or fabricate tomorrow’s menu. Production must use the actual target date and that date’s source serving windows, including Sunday availability, as recorded in PRODUCT.md. The previous screenshot/review artifacts predate this functional addition.
