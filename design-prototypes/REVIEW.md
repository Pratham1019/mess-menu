# Two mobile menu prototypes — owner review

Scope: two replacement visual directions under `design-prototypes/`. The original Daily Sheet remains in `prototype/`. No production ingestion, infrastructure or deployment was implemented.

## Open the interactive prototypes

- [1 — Refined modern utility](http://localhost:4322/modern/lunch/)
- [2 — Expressive editorial utility](http://localhost:4322/editorial/lunch/)
- [Scenario launcher](http://localhost:4322/), including simulated independent source failures.

Both expose Breakfast, Lunch, Snacks and Dinner. Breakfast/Snacks show FC1 and FC2; Lunch/Dinner also show Sindhi Menu 1. The selectors stay visible while scrolling; switching returns to the beginning. These are frozen Thursday 22 October 2026 research fixtures, not current live menus.

## Direction 1 — Refined modern utility

**Identity:** cool grey-green ground, continuous white comparison surface, deep pine accent, Geist. One rounded enclosure unifies the open stack rather than making a separate card for each mess. The inset white selection and restrained shadow make the four-option meal selector immediately recognizable.

**Hierarchy and scanning:** 24px mess names, quiet serving-time labels, regular 16px food at 375px, and 12px provenance. A consistent paired grid creates short, repeatable reading rows. It does not claim categories or importance. Long names wrap naturally; 320px uses 15px/22px dishes without the previous forced single-column fallback. Column minimums use font-relative sizing to accommodate enlarged text.

**Tradeoff:** the paired reading width is narrower, so some long entries need two lines. The layout makes individual dishes easy to locate and gives the comparison a familiar app rhythm, but its identity is quieter than Direction 2.

## Direction 2 — Expressive editorial utility

**Identity:** pale lemon ground, aubergine ink and plum accents. Fraunces supplies the wordmark and mess headings; IBM Plex Sans keeps food clear. A slim underline selector, confident serif anchors and uninterrupted ground create personality through typography rather than decoration.

**Hierarchy and scanning:** 34px mess headings, 16px/27px food, 12px provenance. Entries flow compactly but stay together as individual units when they fit the reading width. An oversized or enlarged entry can wrap with a visible indented continuation. Small dots separate entries; Sindhi retains only its source-provided groups.

**Tradeoff:** the composition is denser and more memorable, with less scrolling. Finding one dish still requires scanning a flowing sequence rather than a fixed grid. This is an editorial treatment of a practical utility, not a newspaper imitation.

## Measured mobile density

Playwright Chromium Android touch emulation, DPR 2, 812px viewport height. Full-page heights below are CSS pixels; screenshot pixel dimensions are doubled.

| Lunch measurement | Modern | Editorial |
| --- | ---: | ---: |
| First dish at 375px | 260px | 267px |
| Complete dish entries in first 375×812 viewport | 20 | 20 |
| Full page at 320px | 1,331px | 1,200px |
| Full page at 375px | 1,329px | 1,143px |
| Full page at 430px | 1,281px | 1,127px |

Both first screens contain all ten FC1 and all ten FC2 lunch entries. Sindhi is open below them and directly reachable through the explicit Jump to controls. All three menus are not claimed to fit in the first viewport. Header/control allocation remains about 260px before food; the gain is more useful food per screen, not a claim that navigation occupies no space.

These measurements establish browser visibility, not that real students have completed the decision task in a measured time. Physical Android, TalkBack and student usability testing remain unperformed.

## Impeccable critique and revisions

Independent visual and technical assessments preceded a bounded revision pass. Final captures replaced the initial captures at the same file paths; initial evidence is retained in the ignored `screenshots/round-1/` folder.

| Review finding | Revision |
| --- | --- |
| Modern emphasized/spanned names by character count | Removed the heuristic; consistent weight and paired grid |
| Modern became a long single-column list at 320px | Kept a responsive paired layout; lunch height fell from 1,595 to 1,331px |
| Editorial split names across paragraph flow | Item-aware inline blocks preserve names as scannable units |
| Jump labels resembled a second selector or passive metadata | Visible Jump to cue; modern directional details and editorial underlines |
| Provenance was small and research context too distant | 12px/18px source notes, concise year uncertainty, visible Snapshot context |
| Secondary touch targets were small | Jump and source hit areas are at least 44×44px |
| No page-level heading | Each active meal has an h1; messes remain h2 regions |
| Failure timestamps could imply successful current checks | Cached/missing sources say Last retrieved; no failed-check time invented |
| Redundant 10px Daily menus label | Removed |

The fresh visual verdict scored all six original visual findings **resolved**, with no introduced material regressions observed across the 16 supplied captures. Its disposition is **ship at prototype scope**, limited to the scored fixes; it is not production approval. See [visual-r1.md](review/visual-r1.md) and [visual-r2.md](review/visual-r2.md).

Technical round 2 resolved four original findings and left jump width partial. The final narrow width correction was independently checked in [technical-r3.md](review/technical-r3.md): all jumps measured 44×44px across 20 inspected states, source links remained at least 44px in both dimensions, and no scoped regression was observed. That verdict closes only the original touch finding; the other four were already resolved in [technical-r2.md](review/technical-r2.md). Original evidence is [technical-r1.md](review/technical-r1.md). The complete final screenshot set was captured again after this width correction.

The source detector ran exactly once: exit 2, three `overused-font` heuristic warnings for Geist/Fraunces declarations, including duplicate declaration sites. They are not accessibility failures. Geist was explicitly contemplated in the brief; Fraunces is a deliberate expressive display choice. The review retained those choices and documented the warnings. Browser injection additionally identified the removed 10px label and a warning-copy wrap detail addressed during revision. No blanket suppression or second detector scan was used. The detector service was stopped; the application preview remains available locally. T3 reported `visible:false` during automation, so no user-visible overlay is claimed.

## Executed verification

- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: nine static pages built successfully.
- `npm run verify`: 24 meal/width/direction states and eight grouped interaction checks passed; zero page exceptions or external requests in the capture flow.
- Every fixture's original items and order checked against rendered `data-original` values.
- All four visible meal targets measured at least 44px high and wide, including 320px.
- Eligible mess order and Sindhi omission verified separately for every meal/width/direction.
- Sticky switching, reset to top, jumps, keyboard End/focus, browser Back and skip navigation exercised.
- Independent mixed-source states exercised across meal switching.
- Computed font sizes doubled for text reflow checks at all three widths, with no horizontal page or dish overflow.
- Meal links followed with JavaScript disabled.
- All 16 final screenshots were opened and checked for intact tops, correct states and complete rendering.

These are the named executed checks, not comprehensive accessibility or performance certification.

## Screenshot originals

| View | Modern | Editorial |
| --- | --- | --- |
| First viewport, 375px | [PNG](screenshots/modern-lunch-viewport-375.png) | [PNG](screenshots/editorial-lunch-viewport-375.png) |
| Lunch full page, 375px | [PNG](screenshots/modern-lunch-full-375.png) | [PNG](screenshots/editorial-lunch-full-375.png) |
| Lunch full page, 320px | [PNG](screenshots/modern-lunch-full-320.png) | [PNG](screenshots/editorial-lunch-full-320.png) |
| Lunch full page, 430px | [PNG](screenshots/modern-lunch-full-430.png) | [PNG](screenshots/editorial-lunch-full-430.png) |
| Breakfast full page, 375px | [PNG](screenshots/modern-breakfast-full-375.png) | [PNG](screenshots/editorial-breakfast-full-375.png) |
| Snacks full page, 375px | [PNG](screenshots/modern-snacks-full-375.png) | [PNG](screenshots/editorial-snacks-full-375.png) |
| Dinner full page, 375px | [PNG](screenshots/modern-dinner-full-375.png) | [PNG](screenshots/editorial-dinner-full-375.png) |
| Independent failures, 375px | [PNG](screenshots/modern-mixed-full-375.png) | [PNG](screenshots/editorial-mixed-full-375.png) |

[Measurements and flow checks](screenshots/verification.json). [Design contract](BRIEF.md). [Setup/provenance](README.md).

## Decision boundary

Both directions remain prototypes awaiting owner approval. Choosing a direction does not authorize deployment. No production app has been implemented.

## Later functional update: automatic entry

After this screenshot/review round, the owner requested clock-based entry selection. `/modern/` and `/editorial/` now select in IST using the captured serving end times; explicit meal routes remain manual. The updated source passed `npm run check` (zero errors/warnings/hints) and `npm run build` (11 static pages). The prior Playwright captures and review verdicts predate this behavior; no new browser test run is claimed. See README.md for the frozen-date limitation and timing cutoffs.
