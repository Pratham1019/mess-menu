# Daily Sheet mobile prototype

Status: A is approved for prototype exploration, with selective composition ideas from C. Production implementation and deployment are not authorized. Mode: Operate.

## Scope

One local, high-fidelity interactive prototype at 375px, verified at 320/375/430px. Use archived 22 October 2026 dish text and actual source categories. Keep fully open messes in order FC1, FC2, Sindhi. One shared sticky meal control; changing meals returns to the top. No accordions, hidden mess tabs, carousels, or nested scrolling. Review scenarios may simulate source failures explicitly; they are not live ingestion.

## Direction contract

THESIS: A readable daily menu sheet organized by mess; precision comes from the headings, rules, and alignment, without narrowing the food column.

OWN-WORLD: IBM Plex Sans, warm #F8F7F2 paper, #20211E ink, and #A83222 selection/focus. Open lists, square meal controls, one divider per mess. C contributes an aligned header for serving time and provenance, rather than a rail beside dishes.

STORY: See the date and meal, read useful food immediately, scan all three messes, and switch meals while retaining a clear beginning. Source failure affects only that mess.

FIRST VIEWPORT: Compact app heading and date; a 44px shared meal control in a sticky strip; direct full-width FC1 dish list followed by FC2. Use 16px/24px dishes, 26px mess headings, and 14px metadata. Measure whether optional jump links earn their height with the real page length.

FORM: Daily Sheet, user-selected direction A, refined by C's header alignment. The prior exploration recorded seed:1e85759c714ebb55; the explicit user choice governs this prototype. Code-led prototype, no new concept tournament.

FINISH: Prototype review requires real mobile screenshots, working interaction and failure-state checks, independent Impeccable assessment, and a scoped design record. This prototype stops for approval; its documentation is not approval to ship production.

## Evidence and constraints

FC1's raw labels omit the year: preserve that uncertainty. FC2's payload has explicit ISO dates; untagged food is not automatically classified. Sindhi uses source sections and a rotation schedule; generatedAt is not manual confirmation. No breakfast/snacks or Sunday service at Sindhi. Preserve all dish names and composite entries. Data retrieval and infrastructure remain outside this prototype.
