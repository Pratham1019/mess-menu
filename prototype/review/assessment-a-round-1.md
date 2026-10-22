# Assessment A — round 1

Method: independent design assessment only, acting as the requested review sub-agent. No detector was run or its results inspected. This is Assessment A for parent synthesis, not a completed dual-assessment critique.

## 1. Direction compliance

**Disposition: FIX at prototype scope.** Preserve the direction; correct the skip-link landing before approving this interactive prototype. Neither rebuild nor screenshot recapture is warranted by the supplied captures.

The composition is specific to a daily mess sheet: serving windows align with mess names, provenance belongs to each source, and source categories structure Sindhi without inventing categories for FC1/FC2. IBM Plex Sans, warm paper, dark ink, square red meal selection, and open lists satisfy A. C contributes header/footer alignment without taking space beside dishes. At 375px the food column is 343px wide; dishes compute to 16px/24px, with 2px vertical padding per side. Mess headings are 26px; metadata/categories are 14px. The hierarchy survives the supplied 320/375/430px lunch captures without visible clipping. Source case, punctuation, FC1 year uncertainty, and Sindhi Menu 1 for both meals are retained.

The first 375×812 screen contains all ten FC1 dishes and the first three FC2 dishes. First food begins around y=288px; the FC2 section starts around y=640px. Lunch is approximately 1584 CSS pixels tall in the live preview, with Sindhi starting around y=1074px. The 48px jump row therefore earns its height by providing direct access to later messes, although it costs nearly two dish rows above the fold. The 62px sticky strip costs reading height during scroll but fulfils the explicit shared-switcher requirement. Keep the full-width lists; do not compress type or introduce a side rail to reduce scrolling.

## 2. Material issues

**Mandatory — skip navigation obscures essential context.** `prototype/src/components/DailySheet.astro:21` links to `main#comparison` at line 44. Unlike `.mess`, that target has no sticky-header scroll offset in `prototype/src/styles/global.css` (compare `.meal-bar` at line 44 and `.mess` at line 54). Reproduced on dinner at 375×812: activating the focused skip link moves focus to `comparison`, scrolls to about 206.5px, and places the FC1 heading at viewport y=16–47px under the sticky strip occupying y=0–62px. Its year warning at y=50–71px is partly obscured too; visually confirmed in the browser. Give the main skip target an appropriate scroll margin/padding, then verify both meals and the mixed scenario with keyboard activation. This particularly affects a sighted keyboard user relying on the skip link for orientation.

**Optional refinement, not a blocker:** the mixed FC2 state offers both “Check the FC2 source” and the footer “Source” to the same URL (`MenuSection.astro`, `.unavailable a` and `.source-line a`). A single clearly labelled recovery link would reduce repetition. The current repetition is understandable and is not a reason to reject the direction.

No additional material issues established. Do not change source casing, remove Sindhi categories, or add invented dietary classifications in response to stylistic preferences.

## 3. Strengths

- Typography and rules carry the identity while long composite entries retain the entire reading width. The larger mess names and quieter serving/provenance text establish a consistent scan pattern; list spacing remains compact without crowding.
- All three messes stay open in FC1 → FC2 → Sindhi order. Sticky selection remains reachable during scroll, and switching from y=700px to dinner updates selection/content/URL and returns to y=0. ArrowLeft also switches the focused dinner tab to lunch and returns to the top.
- Mixed failures are local and explicit: FC1 keeps its saved food with a warning, FC2 substitutes an unavailable message and recovery link, and Sindhi remains readable. Switching to dinner preserves the mixed scenario. These are labelled simulations, not assertions about live source health.

Cognitive load: two meal options and three jump destinations; no decision point exceeds four options. Cross-mess comparison still requires remembering food while scrolling, an accepted tradeoff of the approved stacked layout. The long source lists exceed a generic four-item chunking rubric, but splitting them into invented categories would reduce fidelity. Progressive disclosure is deliberately inapplicable to the fully open mess contract. No competing task or decorative hierarchy interrupts reading.

Emotional journey, inferred from the interface rather than user testing: immediate food and clear selection establish orientation; later-mess comparison introduces scroll effort; source-specific warnings provide a next step without blocking other menus. The footer closes with timezone and snapshot context. The skip-link defect interrupts that orientation for keyboard users.

## 4. Verified scope

Read AGENTS.md, PRODUCT.md, DESIGN_BRIEF.md, prototype/BRIEF.md, the Impeccable skill, craft floor, and Assessment A/heuristic guidance. Used the supplied approved brief as direction authority; no new direction interview was needed for this scoped review.

Opened every required image visually with `view_image`: `lunch-full-320.png`, `lunch-full-375.png`, `lunch-full-430.png`, `lunch-viewport-375.png`, `dinner-full-375.png`, `mixed-full-375.png`, and `sticky-375.png`, all under `prototype/screenshots/round-1/`.

Inspected the named components, stylesheet, interactions, and menu snapshot. Used a new T3 browser tab only, resized to 375×812; inspected lunch, dinner, mixed lunch and mixed dinner, computed type, sticky scroll position, click switching, ArrowLeft switching, panel visibility, and skip-link focus/landing. Browser accessibility snapshots expose named meal tabs, panels, mess regions, source links, and a status region. The source defines additional keyboard handlers and focus styling; those were read, not all exercised. No source links were opened externally.

No app sources or production docs edited; no server started/stopped; no production implementation, ingestion, infrastructure, or deployment performed. The only review deliverable written is this file. No detector artifacts consumed.

Archival heuristic scores (0–4; subjective design assessment, not certification):

| # | Heuristic | Score | Evidence / limit |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Selected meal, checked times, schedule notes and explicit failure states. |
| 2 | Match between system and real world | 4 | Mess names, meals, serving windows and preserved dish/category wording. |
| 3 | User control and freedom | 3 | Reversible meal navigation and jumps; skip landing needs repair. |
| 4 | Consistency and standards | 3 | Cohesive section/control patterns; sticky skip-target exception. |
| 5 | Error prevention | 3 | Year uncertainty, scheduled status and simulated failures are labelled. |
| 6 | Recognition rather than recall | 3 | Open menus and visible controls; cross-mess comparison spans scroll. |
| 7 | Flexibility and efficiency | 3 | Direct mess jumps and keyboard meal switching; no extra tools needed. |
| 8 | Aesthetic and minimalist design | 3 | Purposeful type, rules and accent; minor duplicate recovery link. |
| 9 | Error recognition and recovery | 3 | Local messages, saved food and source recovery; actual recovery not tested. |
| 10 | Help and documentation | 3 | Contextual schedule, uncertainty, timezone and snapshot notes fit this small task. |
| | Applicable total | 31/40 | All ten apply at this utility's scope; no n/a entries. |

## 5. Residual risks

Android screenshots are emulated evidence, not a physical-device or TalkBack test. Browser checks used Chromium at mobile dimensions, without a fresh Android user-agent emulation. Enlarged text, actual screen-reader speech/focus sequencing, browser Back restoration, every keyboard shortcut, offline/no-JavaScript behavior, and desktop use were not verified in this pass. Current long entries fit the supplied captures; more extreme multi-line data remains outside this fixture's evidence. Actual menu freshness, source correctness and ingestion reliability were not re-researched or certified. No user testing or production readiness is claimed.

Questions skipped: one priority issue; this delegated assessment returns findings to the parent rather than soliciting a new direction.
