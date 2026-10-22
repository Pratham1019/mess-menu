# Refined hybrid — owner review

⚠️ DEGRADED: the independent visual assessment completed, but technical-review and documentation tasks hit a provider usage limit. The parent completed technical checks and documentation directly. A full independent second assessment is not claimed.

## Open

[Automatic IST entry](http://localhost:4322/hybrid/) · [Lunch](http://localhost:4322/hybrid/lunch/) · [Mixed-source example](http://localhost:4322/hybrid/lunch/?scenario=mixed).

This is one isolated prototype. No production ingestion, infrastructure or deployment. Earlier explorations remain available; none is silently treated as approved.

## Design critique

- **Identity:** warm paper, deep ink and restrained burgundy; expressive Fraunces branding/mess headings, Plex for food and utility text. Fine rules create structure without enclosing each mess in a card.
- **Readability:** every source entry is a full-width 16px/24px line. No paragraph runs, separators between dish names, or mobile dish columns. Original names/order/composite entries remain intact. Only Sindhi's actual groups become category headings.
- **Hierarchy:** 30px branding, 29px mess names, 16px dishes and 12px/18px provenance. Serving times align with mess headings; independent source date/rotation and retrieval stay distinct in compact footers.
- **Controls:** one tinted, four-option selector with burgundy selection and explicit keyboard focus. The sticky selector stays available; switching returns to the beginning. Meal, jump and source targets are at least 44px in both dimensions.
- **Density tradeoff:** full-width dish lines take more space than the rejected grids/paragraphs, while making individual names directly scannable. At 375×812, all ten FC1 lunch entries and eight FC2 entries are visible. Sindhi remains open below, with direct jump access.

| Lunch measurement | 320px | 375px | 430px |
| --- | ---: | ---: | ---: |
| Complete page height, CSS px | 1,420 | 1,425 | 1,425 |
| First dish top, CSS px | 245 | 248 | 248 |
| Complete entries in first viewport | 18 | 18 | 18 |

The first food is approximately 248px from the top at 375px; no claim is made that all three full menus fit in the first screen. First-screen counts are browser measurements, not student usability results.

## Impeccable assessment and refinement

The independent visual reviewer opened all eight captures and returned **disposition: ship** for the supplied mobile visual scope, with no material visual fixes. Its assessment predates the final narrow muted-color correction and does not certify interactions, owner approval or production readiness. [Visual report](review/visual-r1.md).

The partially completed technical task left a usable one-pass CLI scan: exit **0**, **[] findings**, scoped to Hybrid.astro. These results were reused; no second source scan ran. [Raw detector JSON](review/detector-r1.json).

Direct browser completion found unselected meal text at **4.4759:1** against the selector tint. Muted text changed from #72636A to #706168. Current computed colors yield **4.6123:1** for that state and **5.2662:1** for metadata on paper. Food on paper is **13.5141:1**; selected text/focus against burgundy is **9.1341:1**. These are sampled computed CSS color ratios, not a comprehensive accessibility certification. [Original measurements](review/technical-completion.json) · [Final contrast evidence](review/contrast-fix.json).

The full capture flow repeated after this correction and all final images were opened. No visual topology, type scale or source content changed after the independent visual review.

Browser detector overlay work was not completed after the delegated task failed, and no overlay findings or user-visible overlay are claimed. A leftover detector-only service was stopped with `live-server stop --keep-inject`; app source injection was not added. The local Astro preview was restarted after the interrupted session and remains on port 4322 for owner review.

## Executed verification

- Astro check: **0 errors, 0 warnings, 0 hints**.
- Astro build: **16 static pages**, including the preserved earlier directions.
- Hybrid Playwright flow: **12 meal/width states**, five grouped interaction checks, zero page exceptions or external requests in the capture flow.
- All four meals at 320/375/430; exact source entries/order, full-width block rows and supported mess eligibility.
- Shared sticky selection, reset to top, jump and skip links, keyboard End/focus, browser Back, no-JavaScript navigation and independent mixed states.
- All visible meal/jump/source targets at least 44px wide/high.
- 200% computed font and line-height stress without horizontal page/dish overflow at all three widths.
- Nine IST cutoff/overnight cases; explicit Dinner choice preserved after reload.
- Fresh direct T3 browser measurements at 375 and mixed-source spot checks at 320/430 confirmed full-width rows, sticky navigation, eligibility and independent provenance. Real Tab/ArrowRight input selected Snacks, kept visible focus and returned scroll to 0.

The T3 browser reports visible:false; no user-visible browser overlay is asserted. Physical Android, TalkBack, real students, general Sunday scheduling and production performance remain outside this evidence. [Executed capture log](screenshots/verification.json).

## Content truth

Frozen Thursday 22 October 2026 research fixtures, not live menus. Sindhi uses owner-selected Menu 1. Breakfast/Snacks omit Sindhi entirely. Automatic entry uses IST; after Dinner it selects Breakfast without pretending the fixed research snapshot is tomorrow's menu. Production must later resolve the actual date and source data separately.

## Screenshots

| Capture | Original PNG |
| --- | --- |
| First viewport, 375px | [Open](screenshots/hybrid-lunch-viewport-375.png) |
| Full page, 375px | [Open](screenshots/hybrid-lunch-full-375.png) |
| Full page, 320px | [Open](screenshots/hybrid-lunch-full-320.png) |
| Full page, 430px | [Open](screenshots/hybrid-lunch-full-430.png) |
| Breakfast, 375px | [Open](screenshots/hybrid-breakfast-full-375.png) |
| Snacks, 375px | [Open](screenshots/hybrid-snacks-full-375.png) |
| Dinner, 375px | [Open](screenshots/hybrid-dinner-full-375.png) |
| Independent failures, 375px | [Open](screenshots/hybrid-mixed-full-375.png) |

All PNGs use DPR 2; physical dimensions are twice the CSS viewport dimensions. Full captures begin at the document top.

[Prototype design record](DESIGN.md) · [Contract](BRIEF.md) · [Setup and provenance](README.md).

## Approval boundary

Stop for owner approval or requested refinements. No production ingestion or deployment is authorized by these prototype reviews.
