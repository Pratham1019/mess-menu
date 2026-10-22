# Responsive Hybrid — executed technical checks

Scope: local static prototype and frozen 22 October 2026 fixtures. No production ingestion or deployment.

## Execution

- `npm --prefix design-prototypes run check`: 16 files, zero errors, warnings or hints.
- `npm --prefix design-prototypes run build`: 16 static pages generated successfully.
- `node design-prototypes/scripts/capture-responsive.mjs`: Chromium 156.0.8078.4; 36 meal/width states passed at 320, 375, 430, 599, 600, 768, 1023, 1024 and 1440px.
- Every normal state retained exact original dish strings/order, eligible source order and source category headings against the shared research fixture. This checks fixture fidelity, not current upstream freshness.
- Every dish occupies its own full list width. No horizontal page overflow or nested scrolling observed. Fonts loaded. Visible meal, jump and source controls measured at least 44×44px.
- Mobile menus stack; tablet has FC1/FC2 side by side and eligible Sindhi below; desktop has the appropriate two or three columns. Narrowest tested desktop three-mess column: 293.3px at 1024px. At 1440px: 352px columns with 40px gaps within a 1200px app including 32px gutters.
- Computed font size and line height doubled on Breakfast at every width without horizontal overflow. This is a text stress exercise, not browser zoom or an Android font-scale certification.
- At 375/1440: independently simulated cached FC1 and missing FC2 leave eligible Sindhi intact; manual switching returns to the top; End activates/focuses Dinner; browser Back restores Breakfast; keyboard skip navigation lands clear of the sticky selector.
- Nine automatic IST cutoff/overnight entry cases passed. No-JavaScript native meal-link navigation passed. No uncaught page exceptions or external resource requests occurred in the capture run.

## Measured Lunch density

| Width | Document height | Complete dishes in first viewport | Layout |
| --- | --- | --- | --- |
| 320 | 1628px | 14 | stacked |
| 375 | 1633px | 14 | stacked |
| 430 | 1633px | 14 | stacked |
| 768 | 1034px | 26 | two columns plus Sindhi band |
| 1024 | 900px | 26 | three columns |
| 1440 | 900px | 26 | three columns |

Mobile viewport height is 812px; desktop/tablet is 900px. At 375px, the first dish begins at 262.5px and the first viewport includes all ten FC1 entries and the first four FC2 entries. Full-page and first-viewport 1440px Lunch captures coincide because the full interface fits within 900px.

## Contrast and detector

Calculated sRGB contrast using implemented foreground/background pairs: food on paper 13.51:1; metadata on provenance strip 4.75:1; secondary text on paper 5.27:1; unselected meal on selector 4.61:1; selected meal 9.13:1; burgundy on paper 8.45:1. Subtle row rules are redundant visual separators; semantic lists carry structure.

One CLI detector run on changed Hybrid/Menu/CSS targets returned exit 2: two primary warnings for incumbent Fraunces and sixteen system advisories. The font is retained under the owner's explicit request to preserve expressive serif identity. The detector resolves the sibling Modern/Editorial design record; its cross-world palette/radius warnings do not authorize changing Hybrid. Updated scoped responsive tokens belong in `hybrid/DESIGN.md` and its sidecar. No detector rerun or suppression added.

## Limits

Screenshots use emulated Chromium, Android touch/DPR2 below 600px and desktop/DPR1 above. Physical Android, TalkBack, real student comparison speed, current upstream data and production performance remain outside this review. Source failures are explicitly labelled prototype examples. Owner approval is still required.

Raw results: `../screenshots/verification.json`. Repeatable workflow: `../../../scripts/capture-responsive.mjs`.
