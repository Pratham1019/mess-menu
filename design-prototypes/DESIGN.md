---
name: "Mess menu replacement prototypes — two separate variants"
description: "Source-derived records of Modern and Editorial isolated prototypes; owner approval pending."
colors:
  modern-ground: "#F2F4F3"
  modern-surface: "#FFFFFF"
  modern-ink: "#1C2925"
  modern-muted: "#60716A"
  modern-pine: "#215C49"
  modern-rule: "#DFE6E2"
  modern-tint: "#E7EFEB"
  modern-selector-ground: "#E2E8E5"
  modern-control-text: "#4A5D54"
  editorial-lemon: "#F4F0CF"
  editorial-surface: "#FBF9E8"
  editorial-aubergine: "#362637"
  editorial-muted: "#71634F"
  editorial-plum: "#713E56"
  editorial-rule: "#CEC7A8"
  editorial-tint: "#E8E0BB"
  editorial-link-underline: "#A28D89"
  editorial-dish-separator: "#8B735E"
typography:
  modern-brand:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-1.1px"
  modern-mess-title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.7px"
  modern-dish:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  modern-dish-narrow:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "22px"
  modern-meal:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.45
  modern-meal-heading:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
  modern-provenance:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "18px"
  editorial-brand:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "36px"
    lineHeight: 1.05
    letterSpacing: "-1.3px"
  editorial-mess-title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-1px"
  editorial-meal-heading:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "19px"
    lineHeight: 1.2
  editorial-dish:
    fontFamily: "Plex, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "27px"
  editorial-dish-wide:
    fontFamily: "Plex, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "28px"
  editorial-meal:
    fontFamily: "Plex, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.45
  editorial-provenance:
    fontFamily: "Plex, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "18px"
rounded:
  modern-comparison: "18px"
  modern-selector: "13px"
  modern-meal: "9px"
  modern-state: "8px"
  modern-jump-and-time: "6px"
  editorial-state: "3px"
  editorial-selection-marker: "2px"
spacing:
  modern-gutter: "20px"
  modern-surface-inset: "18px"
  modern-food-offset: "14px"
  modern-dish-row: "7px"
  modern-dish-column: "14px"
  modern-gutter-narrow: "14px"
  modern-dish-row-narrow: "5px"
  modern-dish-column-narrow: "12px"
  modern-selector-inset: "4px"
  modern-selector-gap: "2px"
  editorial-gutter: "22px"
  editorial-gutter-wide: "24px"
  editorial-food-offset: "14px"
  editorial-group-gap: "9px"
  editorial-jump-gap: "7px"
  editorial-jump-gap-narrow: "5px"
components:
  modern-meal:
    backgroundColor: "transparent"
    textColor: "{colors.modern-control-text}"
    typography: "{typography.modern-meal}"
    rounded: "{rounded.modern-meal}"
    height: "44px"
  modern-meal-selected:
    backgroundColor: "{colors.modern-surface}"
    textColor: "{colors.modern-pine}"
    typography: "{typography.modern-meal}"
    rounded: "{rounded.modern-meal}"
    height: "44px"
  modern-meal-hover:
    backgroundColor: "{colors.modern-tint}"
  modern-menu-surface:
    backgroundColor: "{colors.modern-surface}"
    textColor: "{colors.modern-ink}"
    rounded: "{rounded.modern-comparison}"
    padding: "0 18px"
  modern-jump:
    textColor: "{colors.modern-pine}"
    rounded: "{rounded.modern-jump-and-time}"
    height: "44px"
    width: "44px"
  modern-source:
    textColor: "{colors.modern-pine}"
    height: "44px"
  modern-state:
    backgroundColor: "{colors.modern-tint}"
    textColor: "{colors.modern-pine}"
    rounded: "{rounded.modern-state}"
    padding: "10px 12px"
  editorial-meal:
    backgroundColor: "transparent"
    textColor: "{colors.editorial-muted}"
    typography: "{typography.editorial-meal}"
    height: "46px"
  editorial-meal-selected:
    textColor: "{colors.editorial-aubergine}"
    height: "46px"
  editorial-meal-hover:
    backgroundColor: "{colors.editorial-tint}"
  editorial-food:
    textColor: "{colors.editorial-aubergine}"
    typography: "{typography.editorial-dish}"
  editorial-jump:
    textColor: "{colors.editorial-plum}"
    height: "44px"
    width: "44px"
  editorial-source:
    textColor: "{colors.editorial-aubergine}"
    height: "44px"
  editorial-state:
    backgroundColor: "{colors.editorial-tint}"
    textColor: "{colors.editorial-plum}"
    rounded: "{rounded.editorial-state}"
    padding: "10px 12px"
---

# Design System: Mess menu replacement prototypes

## Overview

**Creative North Star: "Two separate utility worlds: Refined Modern / Expressive Editorial"**

This is a descriptive record of two built, isolated Operate prototypes under `design-prototypes/`, not an approved blended system. Modern is a precise cool-ground utility with Geist, inset meal selection and one continuous white comparison surface. Editorial is an independent-publication utility with a lemon ground, Fraunces anchors, IBM Plex Sans dishes and ruled navigation. Each variant keeps its own palette, typography and geometry; shared data and semantics make comparison fair. The original Daily Sheet in `../prototype/` remains a separate artifact.

Owner approval is pending. Fresh bounded reviews scored the original visual and technical findings resolved; their limited scopes are recorded below. This record does not certify production readiness. The shared scenario is frozen Thursday, 22 October 2026, with owner-selected Sindhi Menu 1. It has no production ingestion or general date-selection behavior. Scope and direction language come from `../PRODUCT.md`, `../DESIGN_BRIEF.md` and `BRIEF.md`; measured declarations come from `src/styles/{base,modern,editorial}.css`, `src/components/{Menu,Experience}.astro` and `src/scripts/interactions.ts`.

**Key Characteristics:**

- Modern: cool ground, pine controls, Geist and one continuous white comparison surface.
- Editorial: lemon ground, aubergine type, plum selection, Fraunces anchors and Plex dishes.
- Both: open eligible menus, complete dish names, four visible meals and independent source provenance.
- Prototype scope: frozen Thursday research content, owner approval pending and no production certification.

Historical evidence is in `review/visual-r1.md`, `review/technical-r1.md`, `review/browser-evidence-r1.json` and the `review/detector-r1.*` artifacts. Round 1 visual disposition is `fix`; both reviews describe earlier implementations, including 11px metadata, small jumps and the old dish layouts. Current source differs on those points. `screenshots/verification.json` records a later capture run; it is existing evidence, not a test executed by this documentation pass.

Fresh evidence is in `review/visual-r2.md`, `review/technical-r2.md` and `review/technical-r3.md`. The visual reviewer records `disposition: ship` for the six scored fixes and introduced regressions only, based on sixteen recaptured PNGs; it excludes interaction behavior and 200% text enlargement. Technical round 2 resolved four original findings and left target width partial. The final narrow width correction sets both jump minima to 44px; technical round 3 measured 44×44px jumps across twenty independently inspected states at 375/320px, source targets at least 44px in both dimensions, and no scoped regression. This closes only the original touch finding. These bounded verdicts do not establish physical-device, student usability or production readiness. Owner direction approval remains pending. The documenter did not run browser/tests; the parent synchronized this record after the final correction.

## Colors

### Primary

Modern's **pine** is the selected meal, jump/source link, group label, snapshot cue and focus color. Editorial's **plum** marks the active underline, jump links, serving times, source groups, snapshot cue and focus. These are variant-specific accents, not interchangeable options within one theme.

### Neutral

Modern uses **cool ground** around the **white surface**, with **ink** for food and mess names, **muted green-grey** for supporting text, a separate **selector ground**, and **control text** for unselected meals and service times. **Rule** separates messes, supplied groups and provenance; **tint** supports hover and warnings.

Editorial uses **lemon** as its continuous ground and **aubergine** for food, headings and structural rules. **Muted brown** supports secondary text, **rule** provides the quieter divider, **tint** supports hover and warnings, and **surface** supplies selection/skip-link contrast. Muted underline and dish-separator colors have specific navigation/reading roles; neither is a new accent theme.

The sidecar's tonal ramps are synthesized panel aids, not additional colors used by either prototype. Component snippets remain variant-scoped excerpts and use the named local fonts with the source fallbacks; those font assets belong to the prototype host.

**The Separate Worlds Rule.** Use only the tokens prefixed for the rendered variant; shared semantic structure does not authorize a combined palette.

## Typography

### Modern

**Display Font / Body Font:** Geist, then system-ui and sans-serif. The local variable face is declared for weights 100–900 with swap loading. Brand, mess title, active meal heading, dish and provenance roles are recorded above. The compact wordmark is distinct from the semantic meal heading: the active meal is `h1`, and each mess name is `h2`.

Dishes keep regular weight (400). At widths up to 350px, dishes use the narrow role (15px/22px) and meal labels reduce to 12px. Provenance remains 12px/18px; source links and the snapshot cue use weight 500. Supplied group labels are 11px/500. No character-count classes, spanning heuristics or name-length-driven weight changes exist in the finished source.

### Editorial

**Display Font:** Fraunces, then Georgia and serif. **Body Font:** IBM Plex Sans, registered locally as `Plex`, then system-ui and sans-serif. Plex is declared variable 100–900; Fraunces is declared as a single normal 600 face. Mess headings explicitly request weight 600. The wordmark and meal heading inherit the normal body weight request; the supplied Fraunces face is still the available 600 face. This record does not invent additional Fraunces files or weights. All local faces use swap loading.

At widths up to 350px, the wordmark becomes 33px, mess names 32px, meal labels 12px and dishes retain 16px with 26px leading. From 410px, dishes use the wide role (17px/28px). Default dishes use 16px/27px. Active meals use weight 600 versus unselected 500; provenance is 12px/18px and source links 500. Supplied group labels are 12px, italic, weight 400.

Both variants retain 12px date and snapshot text. Utility text is deliberately subordinate: shared footer and category/jump cues include 11px roles; Editorial's jump cue becomes 10px below the narrow breakpoint. These observed small auxiliary roles are not a blanket minimum-size recommendation for future interfaces.

**The Whole Dish Rule.** Keep complete dish text, source order and uniform food emphasis; layout must not invent food categories or importance.

## Layout

### Shared frame

The centered app is capped at 460px, including gutters under global border-box sizing. It remains a single stacked comparison on larger screens; the source has no desktop column breakpoint. Four equal selector columns use `repeat(4,minmax(0,1fr))`. Meal labels can wrap, including at enlarged text, rather than disappearing or horizontally scrolling. The selector is sticky at top 0 with z-index 10 and an opaque variant ground. Comparison and mess anchors reserve 78px scroll margin. Mess headers and mastheads can wrap; metadata text can shrink and reflow while source links remain unshrunk.

At widths up to 350px, both variants use a 14px outer gutter, the long weekday changes to its short form, date gaps become 8px and the shared service-time rule requests 11px. Editorial's more specific serving-time rule retains 12px. No independent menu scroll area or collapsed menu is introduced.

### Modern

Default outer gutter is the Modern gutter token. The masthead uses 18px top / 8px bottom padding; the date has 12px bottom padding. The selector's 4px inset, 2px gap and minimum 44px options produce a minimum 52px control, followed by 10px sticky-nav bottom padding. The single white surface has the comparison radius and horizontal surface inset tokens. Messes use 18px top / 12px bottom padding, separated by a thin rule; food starts after 14px.

The paired dish grid is exactly `repeat(auto-fit,minmax(min(100%,7.25em),1fr))`, with default 7px row / 14px column gaps. This yields two columns across the target mobile widths at ordinary text size, with natural wraps inside cells. Em-based minima allow a single column when enlarged text needs it; there is no forced one-column 320px rule. Below the narrow breakpoint, surface insets become 14px, mess top padding 16px and gaps 5px / 12px. Supplied groups add 8px spacing and 8px top padding behind a rule. Provenance adds 14px top margin, 10px top padding and a rule; its top margin becomes 12px when narrow.

### Editorial

Default outer gutter is the Editorial gutter token; it becomes 24px from 410px. The masthead uses 20px top / 10px bottom padding and the date has 16px bottom padding. A 46px-minimum selector sits between two 1px rules. The comparison heading has 3px vertical padding and a lower aubergine rule. Messes use 17px top / 13px bottom padding and inter-mess aubergine rules; food starts after 14px.

Each dish is an inline block with `width:max-content; max-width:100%; vertical-align:top`, retaining the whole entry as one unit whenever it fits. `padding-left:.5em; text-indent:-.5em` makes long, enlarged entries wrap with a hanging continuation; `overflow-wrap:anywhere` prevents unbreakable text escaping. Middle-dot pseudo-elements separate items except the last in each list. Supplied groups are separated by 9px, and provenance starts after 13px. This is item-aware flow, not unrestricted paragraph text or newspaper columns.

## Elevation & Depth

Modern uses tonal separation for the page and white comparison surface. Its only declared shadow is the selected meal's restrained `0 2px 5px #13291E13`. It signals state inside the inset selector, not elevation for each mess. Editorial has no declared shadows: continuous ground, dark rules and the active underline establish structure. Neither variant uses decorative gradients, textures or imagery.

There are no authored transitions or animations. Scroll reset is instant; normal document scrolling is auto. The skip link moves into view on focus without a transition. Do not infer an easing or motion scale from this implementation.

## Shapes

Modern's rounded geometry is selective: one comparison enclosure, an inset selector, its selected segment, small service-time backgrounds and jump hover targets. Their distinct radii are the Modern rounded tokens. Service times have 5px / 8px padding; they are factual labels, not interactive chips. Editorial keeps an open ground with square ruled sections, a small-radius active underline and minimally rounded state notes. Its underline is 3px high, inset 10px from each meal option's edges and positioned at bottom −1px.

Shared focus uses a 2px accent outline with 3px offset. Selected Modern meal focus moves the outline inward to −3px; Editorial meal focus uses −4px. The focused skip link uses the variant surface and ink; the focused comparison container suppresses its outline while remaining a programmatic focus target. No card collection, standalone input or button component exists on these comparison routes.

## Components

### Meal navigation

Four visible ordinary links always expose Breakfast, Lunch, Snacks and Dinner, with tablist/tab/tabpanel semantics added to the server-rendered panels. The active panel alone is exposed, and its meal label is the visible `h1`. Minimum option heights are 44px for Modern and 46px for Editorial, not fixed heights: frontmatter component `height` values record these minima. Modern selected meals use white/pine and the state shadow; Editorial selected meals use aubergine weight 600 and the plum underline. Hover uses the variant tint; selected Modern retains its more-specific white background. Focus remains explicit.

Each meal has a native `/{direction}/{meal}/` URL. The small script updates selection, hidden panels, body state, document title and history. Meal activation returns to document top; Back also restores the URL's meal and resets to top. Arrow keys, Home, End and Space select meals with roving tabindex. Modified clicks keep ordinary link behavior. These are observed code paths, not newly executed behavior tests.

### Jump navigation

An explicit “Jump to” cue precedes anchors for every eligible mess. Modern uses pine text, a tiny CSS chevron and compact rounded hover treatment; Editorial uses plum text with a muted underline that strengthens on hover. Both have minimum 44px width and height. Technical round 3 measured the final targets at 44×44px, closing round 2’s width finding. Modern gap is 4px, plus 2px right margin on its cue; Editorial gap is 7px, reduced to 5px when narrow. These links scroll to open sections rather than switch mess tabs.

### Open menu comparison

Eligible messes stay open in FC1, FC2, Sindhi order. Breakfast and Snacks contain only FC1/FC2; Lunch and Dinner also include Sindhi Menu 1 for this fixed Thursday. Sindhi's published groups alone produce group headings. The eligibility helper branches on meal only: it is not a production weekday/rotation engine and does not implement Sunday's closure. Dishes are semantic lists with retained original strings in data attributes; presentation normalizes case, spaces and comma spacing without translation or inferred taxonomy.

### Source provenance

Each mess owns a readable two-line provenance block and a minimum-44px Source anchor, with an inline SVG and an accessible label announcing a new tab. Links use the actual source URL, `target="_blank"` and `rel="noreferrer"`. Modern links are pine; Editorial links are aubergine. Source-note and retrieval text use each variant's provenance token. Their flex row has a 10px gap and can grow in height with text.

The first viewport's date explicitly says “Snapshot.” Normal metadata says “Snapshot check” with the fixture's IST time. FC1 states “Source: 22 Oct · year unknown”; FC2 states “Schedule · 22 Oct 2026”; Sindhi states “Menu 1 · rotating schedule.” These distinct meanings must remain separate. The footer identifies research content and schedules rather than confirmed service.

### Simulated independent states

`?scenario=mixed` explicitly labels a prototype example: FC1 retains food with a cached/update-failed note; FC2 hides only its food and shows an unavailable message and recovery source link; Sindhi remains unaffected when eligible. FC1/FC2 timestamps become “Last retrieved · 22 Oct, … IST”; no failed-check timestamp is fabricated. Warnings use variant tint/accent, 12px text with 1.5 leading and 10px / 12px padding, with the variant state radius. Missing messages use a 16px/600 heading, 14px muted body and a 34ch maximum explanation width. These are simulated states, not current source failures or ingestion behavior.

## Do's and Don'ts

### Do:

- **Do** keep Modern and Editorial token families separate until the owner chooses a direction.
- **Do** keep all four meal options visible, eligible menus open and complete dish names in source order.
- **Do** preserve Modern's em-based grid and Editorial's indivisible dish units with hanging continuations.
- **Do** retain source-specific uncertainty, the Snapshot label and Last retrieved wording for simulated retained data.
- **Do** preserve each review’s bounded verdict and await owner direction approval; resolved prototype findings do not approve production.

### Don't:

- **Don't** turn this prototype record into root production design authority or a blended approved system.
- **Don't** introduce character-count classes, inferred food groups, hidden mess tabs or nested menu scrolling.
- **Don't** infer live menu confirmation, automatic Sindhi rotation or Sunday handling from this frozen Thursday fixture.
- **Don't** promote historical review results, capture assertions or detector heuristics into production certification.
- **Don't** add decorative cards, gradients, food illustrations, animation or features outside the product brief.

The final jump-width correction is synchronized into the tokens and component examples below: both minima are now 44px. Historical review descriptions remain dated evidence. Small auxiliary labels and the single supplied Fraunces weight are recorded observations, not blanket guidance for future screens. Font-prevalence detector warnings remain historical heuristic evidence under the deliberate prototype font choices; no detector rerun or blanket suppression was performed. No broader defect clearance is claimed.

## Functional update: time-based entry

The owner requested automatic current/upcoming meal selection. Both `/modern/` and `/editorial/` now select on entry in IST, keeping a period until the latest eligible serving end time. The frozen Thursday cutoffs are 09:30 / 14:15 / 18:00 / 21:30, exclusive. After Dinner the default becomes Breakfast. Explicit meal links and manual choices win; no background timer changes the active meal. URL replacement makes the selected meal shareable. This adds no visual system change or production ingestion. The prototype date remains the visibly labelled research snapshot; production must resolve tomorrow’s actual date/data rather than relabel this fixture. The prior visual/technical verdicts predate this behavior.
