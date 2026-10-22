---
name: Refined hybrid menu prototype
description: Owner-requested responsive refinement; prototype owner review pending.
colors:
  paper: '#F7F3E9'
  surface: '#FFFCF5'
  ink: '#2C2528'
  muted: '#706168'
  burgundy: '#7C293E'
  rule: '#D8CFC4'
  row-rule: '#E3DCD2'
  provenance: '#EEE7DC'
  selector: '#ECE3DD'
  hover: '#E1D3CE'
  pressed: '#D7C5BE'
  link-underline: '#B99DA3'
typography:
  brand:
    fontFamily: Fraunces, Georgia, serif
    fontSize: 31px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.9px
  brand-narrow:
    fontFamily: Fraunces, Georgia, serif
    fontSize: 29px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.9px
  brand-tablet:
    fontFamily: Fraunces, Georgia, serif
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.9px
  brand-desktop:
    fontFamily: Fraunces, Georgia, serif
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -1px
  mess:
    fontFamily: Fraunces, Georgia, serif
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.6px
  mess-narrow:
    fontFamily: Fraunces, Georgia, serif
    fontSize: 29px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.6px
  mess-desktop:
    fontFamily: Fraunces, Georgia, serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.6px
  meal-heading:
    fontFamily: Plex, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
  meal-heading-toolbar:
    fontFamily: Plex, system-ui, sans-serif
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.2
  meal-heading-desktop:
    fontFamily: Plex, system-ui, sans-serif
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.2
  dish:
    fontFamily: Plex, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  metadata:
    fontFamily: Plex, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
  meal:
    fontFamily: Plex, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.45
  meal-narrow:
    fontFamily: Plex, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.45
rounded:
  selector: 12px
  segment: 8px
  state: 6px
  link: 4px
spacing:
  gutter: 20px
  gutter-narrow: 16px
  gutter-wide: 24px
  gutter-desktop: 32px
  food-start: 0px
  group: 16px
  group-band: 24px
  mess-top: 16px
  mess-bottom: 20px
  mess-top-desktop: 22px
  mess-bottom-desktop: 26px
  mess-header-bottom: 12px
  dish-block: 1.5px
  provenance-block: 8px
  provenance-inline: 10px
  column-tablet: 32px
  column-desktop: 40px
components:
  meal-selected:
    backgroundColor: '{colors.burgundy}'
    textColor: '{colors.surface}'
    typography: '{typography.meal}'
    rounded: '{rounded.segment}'
    height: 44px
  meal-default:
    textColor: '{colors.muted}'
    height: 44px
  jump-link:
    textColor: '{colors.burgundy}'
    width: 44px
    height: 44px
  dish-row:
    textColor: '{colors.ink}'
    typography: '{typography.dish}'
    padding: 1.5px 0
    width: 100%
  source-link:
    textColor: '{colors.ink}'
    height: 44px
    width: 44px
  mess-heading:
    textColor: '{colors.ink}'
    typography: '{typography.mess}'
---

# Design System: Refined hybrid prototype

## Overview

**Creative North Star: "Editorial clarity, everyday utility"**

An isolated responsive prototype combining expressive serif anchors and a continuous warm paper field with polished utility controls. Full-width dish lines, labelled serving windows and compact source provenance carry the task. This owner-requested refinement preserves the pinned hybrid world; owner approval of the final production design and any deployment remain pending.

This scoped record merges the current implementation in [hybrid.css](../src/styles/hybrid.css), [Hybrid.astro](../src/components/Hybrid.astro), [Menu.astro](../src/components/Menu.astro) and [interactions.ts](../src/scripts/interactions.ts), including inherited rules in [base.css](../src/styles/base.css). It applies to the isolated `/hybrid/` prototype. The original Daily Sheet, Modern and Editorial explorations remain separate.

The current [responsive visual review](responsive/review/visual-r1.md) records `disposition: ship` for prototype owner review, all 15 supplied captures valid and no material fixes. This is a visual finish verdict, not owner approval, behavior certification or production release. The parent's [technical report](responsive/review/technical.md) and [verification results](responsive/screenshots/verification.json) record 36 meal/width states across nine widths; those checks were not re-executed for this documentation merge. [REVIEW.md](REVIEW.md) and the earlier mobile review/captures are historical evidence for the former mobile-only prototype. They do not define current responsive values or approval status.

**Key Characteristics:**

- Full-width 28px single-line dish rhythm with natural wrapping
- Serif mess anchors on continuous warm paper
- Four visible meal options and responsive sticky controls
- Stacked mobile, two-column tablet and count-based desktop comparison
- Independent source provenance in compact tonal strips

## Colors

Paper is the continuous ground; ink carries dishes, serif headings and source links. Burgundy is the sole accent for selected meals, serving times, source categories and jump links. Muted text carries supporting information. The selector tint groups controls, while the separate provenance tint quietly grounds source metadata. Row rules are lighter than section boundaries; the final row retains a transparent rule to preserve its rhythm. No gradients or decorative texture.

The parent's current technical report calculates muted metadata on the provenance strip at 4.75:1, secondary text on paper at 5.27:1, unselected meal labels on the selector at 4.61:1 and selected meal text at 9.13:1. These are the implemented foreground/background pairs, not a new contrast audit. Subtle row rules supplement semantic lists rather than carry structure alone.

## Typography

Fraunces is reserved for branding and mess names; locally served Plex handles food and controls. Brand size is 31px normally, 29px at widths up to 350px, 36px from 600px and 40px from 1024px. Mess headings are 30px normally, 29px up to 350px and 32px from 1024px. The meal h1 is 14px below 760px, 20px from 760px and 22px from 1024px.

Dishes remain 16px/24px across all widths. A single-line row totals 28px: 24px line height, 1.5px padding on each block edge and a 1px bottom rule. This is content rhythm, not a fixed height or truncation limit; long names wrap naturally. Metadata is 12px/18px; the serving label and auxiliary jump cue are 11px. Serving values are 12px/18px, weight 500, with tabular numerals; category headings use the same size, line height and weight. Meal labels are 13px, reducing to 12px at widths up to 350px. Source capitalization and spacing are normalized while original strings remain in data.

## Layout

**The Full Line Rule.** Every source dish is a block occupying 100% of its list width, with natural wrapping. No paragraph runs or mobile dish columns. Only source-provided groups become category headings; on tablet, Sindhi's actual groups may share a horizontal band, with individual full-width rows inside each group.

The app is centered and capped at 1200px including gutters. Gutters are 16px below 351px (the implemented media query is `max-width:350px`), 20px normally, 24px from 410px through tablet, and 32px from 1024px. There is no horizontal carousel, nested scrolling or large mess enclosure.

- Mobile below 600px: all eligible messes stack in FC1, FC2, then Sindhi order, separated by 1px ink rules.
- Tablet 600–1023px: FC1/FC2 form two equal columns with a 32px gap and a fine vertical separator. Eligible Sindhi spans the next row below an ink rule. Its actual source groups share an auto-fit horizontal band with 160px minimum group columns and 24px gaps; food within each group remains one full-width item per row.
- Desktop from 1024px: equal columns follow the eligible mess count, three for Lunch/Dinner and two for Breakfast/Snacks, with 40px gaps and fine vertical separators. Sindhi groups return to a vertical list within its own column. At 1440px, the 1200px app has a 1136px content field: three 352px columns or two 548px columns.

Mess padding is 16px top/20px bottom until desktop, then 22px/26px. Mess headers have 12px bottom padding; food itself starts at zero top margin. Source groups separate by 16px in vertical lists. Provenance has 8px block/10px inline padding and a 10px internal gap; it begins 14px after food on mobile. From tablet, food/missing states have 18px bottom margin and auto top margins align provenance strips at the column bottoms. Tablet Sindhi uses a zero provenance top margin; desktop restores its automatic alignment.

Below 760px, only the meal nav sticks at top 0 and the date remains above it. From 760px, the date on the left and bounded nav on the right form one sticky paper toolbar with a 24px gap and 10px top/16px bottom padding. Nav flex-basis is 400px at 760–1023px and 416px from 1024px, with a 300px minimum width. Desktop jump links are hidden because all mess columns are visible together. The toolbar is composed, not stretched into oversized meal controls.

## Elevation & Depth

The only shadow is the selected meal's `0 2px 4px #39222716`. Selector and provenance tints provide functional tonal grouping; menus remain flat and unenclosed, with no shadows. Provenance strips do not become mess cards.

## Shapes

The shared selector has 12px corners and 4px inset; segments have 8px corners and 2px gaps. State notes use 6px corners; jump hover targets use 4px. Mess sections and provenance strips remain square and unenclosed.

## Components

Four visible options: Breakfast, Lunch, Snacks, Dinner. The selected segment is burgundy with surface-colored text. Selected keyboard focus uses a 2px surface outline inset 4px; other focus uses burgundy. Hover/press colors are recorded tokens; the 120ms background/text color transition is removed for reduced motion. All main selector, jump and source targets are at least 44px in both dimensions. Component frontmatter width/height values describe minimums, except the full-width dish row; row height grows with wrapping.

The responsive sticky selector/toolbar follows Layout. A ResizeObserver watches both nav and toolbar and sets anchor offset to `Math.ceil(active sticky element height) + 16px`; comparison and mess targets use that value, with an 80px CSS fallback. Native meal links remain when JavaScript is unavailable. The existing small script provides tab selection, arrow keys, Home/End, Space activation, URL/history and reset to the top when changing meals. It does not switch meals in the background.

Each selected meal has one h1, messes h2 and only supplied categories h3. The muted “Serving” label precedes burgundy serving times opposite the mess name, wrapping when necessary. Each compact provenance strip keeps source date/rotation and retrieval on separate lines. Source links are ink with an underline, changing to burgundy on hover, with independent 44px minimum targets and an accessible new-tab label.

Automatic `/hybrid/` entry uses IST and captured serving end times; explicit routes and manual choices win. Frozen Thursday cutoffs are 09:30, 14:15, 18:00 and 21:30, exclusive. After Dinner, Breakfast is selected, but the visibly labelled research date stays Thursday 22 October 2026. This prototype does not implement the production requirement for an actual next-day menu; no current/tomorrow data is fabricated.

Breakfast/Snacks show FC1 and FC2 only. Lunch/Dinner also show owner-selected Sindhi Menu 1 from the frozen Thursday research fixture. Product eligibility remains Lunch/Dinner Monday–Saturday only; this prototype's fixed Thursday fixture does not implement a live calendar or Sunday rollover. The mixed example explicitly simulates cached FC1 and unavailable FC2; unaffected eligible sources retain their food and provenance. There is no production ingestion, loading pipeline or live confirmation of service.

The sidecar retains five implemented component examples: four-meal selector, selected meal, jump link, individual dish lines and source provenance. They illustrate the same controls and content patterns; they introduce no new components.

## Do's and Don'ts

- Do preserve complete source names, compound entries, order and actual groups.
- Do use the paper/ink/serif identity with restrained burgundy state cues.
- Do keep every eligible menu open and the meal selector visible.
- Do distinguish source dates, schedule rotation and snapshot retrieval from live service confirmation.
- Don't split a source list into food columns, use dot-separated paragraphs, invent categories or add repeated mess cards.
- Don't stretch desktop navigation across the full comparison width.
- Don't relabel research fixtures as live or tomorrow's menus.
- Don't treat prototype review as owner approval or production certification.
