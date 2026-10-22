---
name: "Daily Sheet — isolated prototype"
description: "As-built prototype tokens pending owner approval; NOT production approval."
colors:
  accent: "#a83222"
  paper: "#f8f7f2"
  ink: "#20211e"
  secondary: "#62635e"
  rule: "#d7d6d0"
  selection: "#e7c5bc"
  meal-hover: "#efede6"
  meal-active: "#e8e4da"
typography:
  masthead:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  masthead-compact:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  mess-title:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  meal-label:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  date:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  metadata:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  schedule:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  category:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.45
  unavailable-title:
    fontFamily: '"IBM Plex Sans", "Arial", sans-serif'
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.5
spacing:
  dish-row-block: "2px"
  control-gap: "4px"
  header-gap: "12px"
  category-gap: "13px"
  sheet-compact: "12px"
  sheet: "16px"
  sheet-wide: "20px"
  touch-minimum: "44px"
  anchor-offset: "78px"
components:
  meal-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    typography: "{typography.meal-label}"
  meal-unselected:
    textColor: "{colors.ink}"
    typography: "{typography.meal-label}"
  meal-unselected-hover:
    backgroundColor: "{colors.meal-hover}"
  meal-active:
    backgroundColor: "{colors.meal-active}"
    textColor: "{colors.ink}"
  food-list-item:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "2px 0"
  saved-warning:
    typography: "{typography.metadata}"
    padding: "10px 0"
  unavailable-message:
    padding: "18px 0 8px"
---

# Design System: Daily Sheet — isolated prototype

## Overview

**Creative North Star: "Daily Sheet"**

Daily Sheet A uses warm paper, dark ink, open food lists, and restrained typographic hierarchy. Selective C influence aligns mess names with serving times above the food; it does not create a rail beside dishes. Menus remain the primary content in this Operate surface.

**These are scoped prototype tokens pending owner approval and are NOT production approval.** The owner authorized one interactive prototype, including Sindhi Menu 1. Production implementation, ingestion, infrastructure, and deployment remain unapproved. This record describes the built prototype, not a new direction or a production design system. Independent review findings were corrected and checked at prototype scope; see REVIEW.md for the precise verdicts and limits. These checks do not approve production. The skip-to-menus offset and selected-meal focus correction are reflected in the current values below.

**Key Characteristics:**

- Full-width food lists in one document, ordered FC1, FC2, Sindhi.
- One common sticky Lunch/Dinner control with instant return to the beginning.
- Warm paper and ink, square selection, thin structural rules.
- Source-specific provenance and explicitly simulated failure states.

Evidence: [prototype contract](BRIEF.md), [local review instructions](README.md), [global styles](src/styles/global.css), [DailySheet](src/components/DailySheet.astro), [MenuSection](src/components/MenuSection.astro), and [interaction code](src/scripts/interactions.ts). Inspected final images: [375px lunch viewport](screenshots/lunch-viewport-375.png) and [375px full lunch](screenshots/lunch-full-375.png). The full image shows all three messes and Sindhi's Menu 1 categories; the viewport shows useful FC1 dishes and the beginning of FC2.

Local entrypoints are `/` and `/lunch/` for lunch, `/dinner/` for dinner, and `/lunch/?scenario=mixed` for the scripted failure example. [Dynamic meal page](src/pages/[meal].astro) generates the two meal routes. [/review/](src/pages/review.astro) is a separate review launcher, not a proposed product feature.

Documentation limits: this pass read code and existing 375px captures; it started no server and ran no UI, accessibility, or performance tests. Existing [320px lunch](screenshots/lunch-full-320.png), [430px lunch](screenshots/lunch-full-430.png), [mixed-state](screenshots/mixed-full-375.png), and [sticky](screenshots/sticky-375.png) files are additional evidence locations, not new verification by this pass. No unsupported tonal ramps, shadows, motion scale, or new components are inferred. The version-2 sidecar extends this frontmatter; primitives live here rather than in legacy JSON token arrays.

## Colors

The frontmatter records the literal CSS values, including the small number of interaction colors.

### Primary

- **Brick accent** (`accent`): selected meal background, ordinary link hover, focus outline, and the explicit simulated-failure review label.

### Neutral

- **Warm paper** (`paper`): page and opaque sticky strip; selected meal text.
- **Dark ink** (`ink`): dishes, mess names, source links, and structural rules; inset focus outline on the unselected meal.
- **Secondary ink** (`secondary`): provenance, checked time, categories, and footer copy. Despite its CSS name, this is neutral text, not a second brand accent.
- **Soft rule** (`rule`): saved-menu warning boundaries.
- **Selection tint** (`selection`): browser text selection, with ink text.
- **Meal hover / pressed paper** (`meal-hover`, `meal-active`): transient meal-control feedback.

**The Purposeful Accent Rule.** Use the accent for selection, focus, link hover, and the explicit review-scenario label; do not color food categories by inferred diet or quality.

## Typography

All roles use the locally hosted variable IBM Plex Sans, with Arial and sans-serif fallbacks. The source declares weights 100–700 with `font-display: swap`; the interface uses regular (400), medium (500), and semibold (600). Regular is the inherited body weight; no additional display face is introduced.

At the default 16px root size, the masthead and mess names are 26px. The masthead is 600/1.16 with −0.035em tracking, reducing to 24px at widths up to 340px. Mess names remain 26px, 600/1.2, with −0.025em tracking. Dishes are 16px/24px, weight 400, with 2px top and bottom padding per item, giving a 28px single-line row. Meal labels are 16px, weight 500. The date is 15px/22.5px.

Metadata is 14px/21px, weight 400. Schedule notes use 14px/20.3px; source category headings use the same size and leading at weight 500. Serving times use tabular numerals and do not wrap. An unavailable-state heading is 18px/27px, weight 500; warning emphasis is weight 600. There is no imposed dish line-length cap inside the food column.

**The Source Text Rule.** Preserve source casing, spelling, punctuation, composite entries, and source-provided categories; uppercase FC1 dishes are content, not a reusable uppercase typography treatment.

## Layout

The sheet is centered with a maximum outer width of 42rem (672px at the default root size). It remains one vertical column even on desktop; this build has no three-column comparison layout. Header metadata may wrap above food. Dishes occupy the entire inner sheet width without a side rail, decorative container, nested scroll area, accordion, or carousel.

| CSS viewport | Side padding | Inner food width | Masthead |
| --- | --- | --- | --- |
| 320px | 12px | 296px | 24px |
| 375px | 16px | 343px | 26px |
| 430px | 20px | 390px | 26px |

These widths are derived from the source under normal root sizing, not newly measured in this pass. The narrow adjustment applies at `max-width: 340px`; the wider gutter begins at `min-width: 400px`. At enlarged text sizes, labels and metadata may reflow; dishes use `overflow-wrap: break-word`.

The page header has 22px top and 15px bottom padding. Its baseline-aligned masthead wraps with a 12px gap; the date starts 7px below. Each mess has a 1px ink top rule, 15px top padding, and 19px bottom margin. Its heading/time row has 6px vertical and 12px horizontal gaps. The schedule note starts 3px below; food starts 11px below. Source categories have a 13px inter-category gap and a 3px heading-to-list gap. Provenance starts 9px after food and has a 44px minimum height with a 12px gap. The page footer has an ink top rule, 18px top / 28px bottom padding, and 4px between paragraphs.

The shared meal bar sticks at viewport top (0), with z-index 10 and opaque paper. Its 7px top / 9px bottom padding, 44px minimum controls, and two 1px borders make a 62px strip at default type sizing. The two equal-width controls have a 4px gap. Below it, mess jumps use a 48px minimum row, 44px minimum link heights, and horizontal gaps of 21px (19px at widths up to 340px); the row can wrap.

Both the comparison start and each mess use `scroll-margin-top: 78px`. At the default strip height, this leaves 16px below the sticky bar for the target. The skip link targets the comparison start; mess jumps target the selected meal's mess ID. The skip link sits at left 16px / top 8px with 10px 14px padding, z-index 20, and is translated above the viewport until focused. The corrected comparison offset is part of this record; it is not evidence of a completed visual verdict or of an adaptive measured-height offset.

**The Open Sheet Rule.** Keep FC1, FC2, and Sindhi fully open in that order, with full-width food lists and one shared meal control; changing meals returns to the beginning.

## Elevation & Depth

There are no authored shadows, gradients, glow, or decorative layers. Thin ink rules establish sections; soft rules bound the saved-menu warning. The opaque sticky strip stays readable through positioning and its borders. Z-index is functional: meal bar 10, focused skip link 20. No animation or transition duration/easing tokens are defined; meal changes scroll instantly, while skip-link visibility changes directly through its focus state.

## Shapes

Meal selection is a square-cornered rectangular fill spanning one grid half. There is no authored radius scale. Lists have no bullets, inset boxes, or decorative cards. Links retain a 1px underline with a 0.22em offset; ordinary keyboard focus is a 2px accent outline with a 4px offset. Meal focus uses a 2px outline inset by 3px: paper on the selected red meal and ink on the unselected paper meal. The sidecar carries these details because frontmatter component tokens cannot express borders and focus rings.

## Components

### Shared meal switch

Two anchor tabs use real `/lunch/` and `/dinner/` destinations and expose `aria-selected`, `aria-controls`, and roving tabindex. The selected meal is accent on paper text; an unselected hover uses meal-hover paper. The pressed state uses meal-active paper and ink text. Focus uses the contrasting selected/unselected inset outline described above. No disabled, loading, or other meal variants exist.

The script swaps pre-rendered panels, updates URL/history and jump targets, announces the meal and mess order, and scrolls instantly to top, including a click on the already-selected meal. Arrow keys wrap between meals; Home/End select first/last; Space activates. Browser Back reapplies the scenario and returns to the beginning. Plain links remain meal navigation without JavaScript; mixed-state simulation is script-dependent. Sidecar snippets depict visual states only and do not replace these behaviors.

### Mess header and food list

An accessible section heading and right-aligned serving time share a wrapping baseline row. The date/schedule note sits underneath; food has its own full-width block. Semantic lists preserve each supplied item as one entry, even if it contains commas. Only Sindhi's source sections produce category headings. FC1 and FC2 have no invented mains/sides or diet grouping.

### Source line and source-specific states

Each mess retains its source link, including in failure states. The link has a 44px minimum width and height, opens a new tab, and has a source-specific accessible label. The checked timestamp is research retrieval time in IST, not a statement that staff verified the meal. The page footer states IST and the fixed research date.

| Source | Complete fixture | Explicit mixed simulation |
| --- | --- | --- |
| FC1 | `22 Oct · year not supplied`; dishes; `Checked 17:03 IST` | The same dishes and checked time remain; a soft-rule warning reads `Saved menu. Refresh unavailable; check the source before you go.` |
| FC2 | `Published schedule · 22 Oct`; dishes; `Checked 17:05 IST` | Schedule note becomes `Source unavailable`; dishes are hidden; `Menu unavailable` and `FC2 could not be reached. Check the source or try again later.` appear; freshness becomes `No saved menu`. |
| Sindhi | `Menu 1 · rotating schedule`; source sections; `Checked 17:28 IST` | Remains available and unchanged while the other sources demonstrate independent failures. |

The saved warning has 10px vertical padding, a 10px top margin, 14px/21px copy, and 1px soft-rule borders. Unavailable content has 18px top / 8px bottom padding, an 18px heading, and 16px explanatory copy with a 5px top gap. States use text and structure rather than new semantic colors or fabricated dishes. The scenario label `Prototype · simulated source failures` appears under the date and a footer repeats that failures are simulated. This is a fixed demonstration, not a live stale-age policy, retrieval mechanism, retry action, or claim that the real sources failed.

### Fixture and Sindhi Menu 1 scope

The interface renders the authored [menu snapshot](src/data/menu-snapshot.json) through [menu types and order](src/data/menu.ts), fixed to Thursday, 22 October 2026. No menu source is fetched by this prototype. Source links point to FC1's bluspring site, FC2's tikmit site, and Sindhi's source site; their displayed text and schedule qualifiers remain source-specific.

Sindhi Menu 1 was explicitly selected by the owner. [MENU1_SOURCE.json](MENU1_SOURCE.json) records research retrieval evidence; this selection does not assert that an automatic rotation chose Menu 1 that day. Lunch preserves `Non-Veg`, `Veg`, and `Veg Sides`; dinner preserves `Veg` and `Veg Sides`. Thursday dinner is `Gobi Manchurian`, `Matar Paneer masala`, `Dal`, `Rice`, `Chapati`, and `Suji halwa`. No breakfast, snacks, Sunday service, or day-navigation feature is added. FC1's absent year stays uncertain, FC2's published schedule is not promoted to confirmed service, and Sindhi schedule generation is not manual confirmation.

## Do's and Don'ts

### Do:

- **Do** keep the scoped prototype pending owner approval; its tokens are not production approval.
- **Do** preserve full-width lists, stable FC1/FC2/Sindhi order, and instant switch-reset-to-start.
- **Do** retain the corrected 78px comparison and mess offsets when documenting this build.
- **Do** preserve source text, qualifiers, checked times, source links, and the owner-selected Sindhi Menu 1 scope.
- **Do** label failure examples as simulated and distinguish saved dishes from unavailable dishes.

### Don't:

- **Don't** infer production authorization or completed review results from this documentation.
- **Don't** invent menu items, source categories, dates, freshness guarantees, or automatic rotation decisions.
- **Don't** turn FC1's source uppercase into a typography rule for other content.
- **Don't** narrow the mobile food column with metadata rails, cards, hidden mess tabs, or nested scrolling.
- **Don't** synthesize unsupported token ramps, component variants, or production behavior.
