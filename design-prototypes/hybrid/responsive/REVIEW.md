# Responsive Hybrid refinement

Status: ready for owner review. The owner has not approved production implementation or deployment.

## Composition and readability

The existing paper/ink/burgundy and Fraunces/Plex identity is preserved. The app now has a 1200px outer maximum, including desktop gutters. At 1440px Lunch and Dinner have three 352px mess columns, with 40px gaps and fine vertical dividers. Breakfast and Snacks have two balanced columns. The date and bounded 416px meal selector form a shared toolbar; source strips align at the bottom of the comparison. Desktop jump links are omitted because every mess is visible together.

Below 600px, every eligible mess stays open in a vertical stack, with one full-width dish per row. At tablet widths, FC1/FC2 share the first row and Sindhi spans the next; only Sindhi's published categories share that wider band. No categories, food rankings or dish details were inferred.

Readability comes from scale and rhythm: expressive mess names, labelled burgundy serving windows, 16px/24px food, light row separators, stronger section rules and compact 12px provenance. Underlined source links remain secondary but clearly interactive. Full names and natural wrapping are preserved.

## Critique and refinement

The first parent inspection found that 31px dish rows made mobile Lunch unnecessarily long. A single refinement batch reduced rows to 28px and tightened mobile mess padding. The final 375×812 first viewport contains all ten FC1 entries and four FC2 entries; the full Lunch document is 1633px. Desktop contains all 26 Lunch entries within the 900px viewport. Short Snacks menus intentionally leave open ground below rather than stretching food rows.

The independent Impeccable reviewer opened all fifteen final captures and returned **`disposition: ship` for prototype owner review**, with no material visual fixes. See [visual-r1.md](review/visual-r1.md). This is a visual finish verdict, not owner approval or production certification.

The accepted mobile tradeoff remains sequential comparison: Sindhi requires scrolling or a jump. The sticky four-meal selector and visible jumps preserve access. Source data is still the labelled 22 October research snapshot; the time-based default does not claim current or tomorrow's dishes.

## Required screenshots

| Capture | Mobile | Desktop |
| --- | --- | --- |
| Full Lunch page | [375px](screenshots/hybrid-lunch-full-375.png) | [1440px](screenshots/hybrid-lunch-full-1440.png) |
| First viewport | [375×812](screenshots/hybrid-lunch-viewport-375.png) | [1440×900](screenshots/hybrid-lunch-viewport-1440.png) |

Desktop Lunch fits inside the viewport, so its full-page and first-viewport captures are identical. Further captures include all four meals at 375/1440px, Lunch at 320/430/768px, and independent mixed-source states at 375/1440px. All fifteen were visually opened by both parent and reviewer.

## Executed checks

Astro check/build passed. Playwright checked 36 meal/width states at 320, 375, 430, 599, 600, 768, 1023, 1024 and 1440px. Fixture strings/order/categories, eligibility, topology, full-width rows, visible 44px targets and no horizontal/nested scrolling passed. Keyboard/history/reset/skip, no-JavaScript links, independent source failure examples, nine IST entry boundaries and 200% computed text stress also passed. See [technical.md](review/technical.md) and [raw verification](screenshots/verification.json) for scope and limits.

One detector run recorded two incumbent serif warnings and sixteen design-system advisories; these do not authorize replacing the owner-pinned world. The scoped design documentation records the current responsive values. No production pipeline or deployment was created.

## Review locally

- [Lunch](http://localhost:4322/hybrid/lunch/)
- [Automatic IST entry](http://localhost:4322/hybrid/)
- [Independent failure example](http://localhost:4322/hybrid/lunch/?scenario=mixed)

From `design-prototypes/`: `npm run check`, `npm run build`, `npm run preview`; then `node scripts/capture-responsive.mjs`.
