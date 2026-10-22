# Technical review — round 1

Method: independent Assessment B, browser and detector evidence. Visual reviewer output was never read. `visual-r1.md` existed before this report was released. This is a review of frozen local prototypes, not production approval.

Reviewed live at `http://localhost:4322`: both Lunch designs, Modern Breakfast, Editorial Snacks, both mixed Lunch states, plus keyboard selection through all four meals in both designs at 320×812. Primary viewing was 375×812, with 430px Lunch spot checks. No app sources, original Daily Sheet, server lifecycle, or deployment were changed. Parent check/build/capture results were not rerun or treated as my own tests.

## Findings

No P0 or P1 blocker observed in the tested mobile comparison flows. The following are localized improvements.

1. **P2 — source/freshness details are unnecessarily small in both designs.** `.source-meta` and `.source-note` are 11px with a 15.95px line height, while dishes are 16px at 375. Those notes carry essential uncertainty: FC1's absent source year, FC2's published schedule, and Sindhi's rotating Menu 1. They pass contrast and fit without truncation, but require more visual effort than the menu decision should require. Increase to 12–13px and allow wrapping. Evidence: `src/styles/base.css:5`, `src/styles/modern.css:4`, `src/styles/editorial.css:4`; computed details in `browser-evidence-r1.json` and the saved 375px screenshots. This is a readability recommendation, not a WCAG minimum-font-size failure.

2. **P2 — mobile jump links are much smaller than the primary selector.** At 375, Modern FC1/FC2/Sindhi jumps are 40×28px; Editorial jumps are 34×30px, with only 6px gaps. Source links are approximately 52–54×36px. Primary meal options are correctly at least 44px tall. Increase jump/source hit areas toward 44px while keeping text and layout compact. These measured jumps meet the 24px minimum; the concern is one-handed touch comfort, not a claimed WCAG AA target-size failure. Evidence: `.jump a` and `.source-meta a` in the styles and browser rectangles.

3. **P2 — the page has no level-one heading.** Active heading sequences begin with FC1 `h2`, then FC2 `h2`, then Sindhi `h2` at Lunch/Dinner. The meal title is a `span`; the masthead is a `div`. Make the active meal title a visually unchanged `h1` so heading navigation starts with the purpose of the comparison. Preserve the existing named tabpanel and mess regions. Evidence: `src/components/Experience.astro:12`, `:15`; live accessibility trees and `headings` in the evidence JSON. This is a navigation/hierarchy improvement, not a claim that every page lacking `h1` automatically fails WCAG.

4. **P3 — mixed-state timestamps could identify last successful retrieval more precisely.** FC1 says “latest check failed” but still labels 17:03 as “Checked”; FC2 shows “Source unavailable · last retrieved 22 Oct” then “Checked 17:05 IST.” The simulated failure is clearly labeled and independent, so there is no claim of current successful service. Nevertheless, use “Last retrieved 22 Oct, 17:03 IST” / “17:05 IST” in this scenario to separate the retained snapshot time from a later failed check. Do not fabricate a failed-check time. Evidence: `src/scripts/interactions.ts` mixed branch and `src/components/Menu.astro:14`.

5. **P3 — Modern has a redundant 10px label.** “Daily menus” is rendered at 10px above the selector. Remove this redundant label, or raise it to the secondary-text scale. This is the browser detector's actual `undersized-ui-text` finding, not a source-CLI finding. Evidence: `src/styles/modern.css:2`, `.edition`; 375px screenshot and browser console archive.

## Verified behavior and accessibility

- All four meal labels remain visible at 320px. Modern targets are 69.5×44px; Editorial targets are 73×46px. No horizontal page overflow was observed in those states or either 375/430px Lunch state.
- Actual Tab → selector → Home/ArrowRight keyboard sequences selected Breakfast, Lunch, Snacks, Dinner in both designs. Focus was visible in every selected state; `aria-selected`, roving `tabindex`, active tabpanel, URL, and document title changed together. Every tested change reset scroll to 0. Existing native anchor hrefs remain available for navigation; source anchors have actual source URLs, `target=_blank`, `rel=noreferrer`, and specific accessible labels announcing the new tab.
- Focus on an unselected tab was also inspected: Modern has a 2px green outline with 3px offset; selected Modern uses −3px offset. Editorial uses a 2px plum outline with −4px offset. They were visible, not clipped, and contrast passes on their adjacent surfaces. Modern selected ring 7.80:1 against white; unselected ring 6.28:1 against the selector ground. Editorial ring 7.21:1 against the page.
- Actual keyboard skip activation focused `main#comparison`. Its top landed at approximately 78px: below the Modern selector bottom at 75.9px, or exactly below the Editorial selector bottom at 78.2px. FC2 keyboard jumps also left its heading visible below the sticky selector: Modern heading top 97px vs nav bottom 62px; Editorial heading top 170.4px vs nav bottom 48px (document-end scroll limit). The next Tab reached the FC2 source link with visible focus.
- Normal content is semantic `ul`/`li` inside labeled mess regions. Sindhi alone has source-provided Non-Veg, Veg, Veg Sides labels. No new mains/staples/dessert categories were found. Hidden panels' headings were absent from the active heading sequence. The preview accessibility snapshot did serialize extra decorative separator text around Editorial's hidden panels; no screen reader session was run, so that serialization is not promoted to a confirmed assistive-technology defect.
- Breakfast and Snacks expose FC1 and FC2 only, without Sindhi failure text or a Sindhi jump. Lunch and Dinner include Sindhi Menu 1. This fixed Thursday fixture does not test Sunday scheduling.
- In both mixed Lunch states FC1 keeps its dishes with a cached warning, FC2 hides only its own dishes and retains a source/recovery link, and Sindhi keeps its dishes and original independent source note. A visible “Prototype example” label identifies simulated failures.
- Independent source notes are visible alongside each mess: FC1 22 Oct/year absent, checked 17:03 IST; FC2 published schedule 22 Oct, checked 17:05 IST; Sindhi rotating Menu 1, checked 17:28 IST. Footer explicitly calls these schedules rather than confirmed service, and identifies the 22 October research snapshot. These source claims were checked against local supplied fixtures; no live upstream data was fetched.

## Computed contrast

Opaque CSS surfaces and computed text colors were measured in the browser; these are WCAG luminance ratios, not pixel sampling or a claim of a full accessibility audit. Theme values are shared across the four selection states, and each was exercised by keyboard.

| Text/state | Modern | Editorial |
|---|---:|---:|
| Dish text | 15.07:1 | 12.23:1 |
| Source date / retrieval metadata | 5.16:1 | 5.06:1 |
| Date / footer on page ground | 4.67:1 | 5.06:1 |
| Unselected meal | 5.66:1 | 5.06:1 |
| Selected meal | 7.80:1 | 12.23:1 |
| Serving times | 6.37:1 | 7.21:1 |
| Cached warning / scenario note | 6.67:1 | 6.26:1 |
| Missing-source explanation | 5.16:1 | 5.06:1 |

All sampled body/metadata text passes 4.5:1. Focus passes 3:1. The small text finding concerns reading comfort despite passing contrast.

## Exact one-pass CLI detector results

Command, run exactly once from the repository root:

```text
.agents/skills/impeccable/scripts/impeccable detect --json design-prototypes/src
```

Exit code **2**; **3 findings**, all severity `warning`, category `slop`, rule `overused-font`, name “Overused font”. Full unmodified JSON: `review/detector-r1.json`; stderr is empty in `review/detector-r1.stderr`; recorded exit status: `review/detector-r1.exitcode`.

| File (relative to workspace) | Line | Exact snippet | importedBy |
|---|---:|---|---|
| `design-prototypes/src/styles/base.css` | 2 | `font-family:Geist` | `Experience.astro`, `index.astro` |
| `design-prototypes/src/styles/base.css` | 4 | `font-family:Fraunces` | `Experience.astro`, `index.astro` |
| `design-prototypes/src/styles/editorial.css` | 2 | `font-family:Fraunces` | `Experience.astro` |

Each JSON entry carries the exact description: “Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, and Space Grotesk are used on so many sites they no longer feel distinctive. Each new wave of AI-generated UIs converges on the same handful of faces. Choose a face that gives your interface personality.”

**Scoped interpretation / false positives:** these are heuristic distinctiveness warnings, not accessibility or behavior errors. The source scan flags declarations even when a face is unused on the current direction. Geist is explicitly permitted as a candidate in DESIGN_BRIEF.md; its prevalence alone is not a brief violation. Fraunces in base.css and editorial.css describes the same editorial display choice, not two separate product defects. Fraunces declarations do not establish that Modern uses Fraunces. No forced font substitution is recommended from this scan alone.

## Browser detector injections

One detector service was started (PID 84667, port 8400). Mutable evaluation was proven by changing the title and appending an inline script that set `window.__reviewInjectionProof=true`. The external detector script then loaded successfully from `http://localhost:8400/detect.js` on three representative views, with approximately 2.2 seconds allowed per injection. The live script's automatic execution is distinct from the one source CLI scan; it was not manually invoked again.

| View, at 375×812 | Automatic detector console result |
|---|---|
| Editorial Lunch | `[impeccable] No anti-patterns found.` |
| Modern Lunch | `2 anti-patterns found`: `undersized-ui-text` — `10px functional text "Daily menus" (below 11px floor)`; `overused-font` — `Primary font: geist (100% of text)` |
| Editorial Lunch mixed | `1 anti-pattern found`: `straggler` — `"changed." alone on the last of 2 lines (17% of the measure)` |

The mixed-state straggler is reproduced visually in the warning paragraph; it is a minor wrap detail only, not lost content or a failure to understand the warning. Consider balanced wrapping if this text is retained. Font interpretation is scoped above. Full console entries, including non-detector preload warnings, are preserved in `browser-evidence-r1.json`; logs are cumulative within this one tab and their timestamps distinguish injections.

**Actual visibility:** the title was labeled `[Human]` and `preview_open(show=true, open=true)` was attempted, but `preview_status` continued to report `visible:false`. Script injection and execution succeeded; the mixed view had an `impeccable-overlay impeccable-visible` DOM element. A user-visible inline overlay was therefore **not verified** and must not be claimed. Browser screenshots, console output, and computed styles are the fallback evidence. No app HTML was edited to inject scripts. Navigation removed injected page state afterward.

## Run notes and handoff

- Target: `design-prototypes/src` in the requested workspace. A critique slug was not separately generated for this delegated evidence task; this report uses the parent's explicitly requested artifact path.
- Ignore list: `.impeccable/critique/ignore.md` absent; no findings suppressed.
- Assessment independence: no visual review contents or prior critique outputs read. Only existence of `review/visual-r1.md` was checked before disclosure.
- CLI: one complete scan; no rerun. Browser: three automatic detector injections on one dedicated new tab. No capture-suite or check/build rerun.
- Detector cleanup executed successfully: `impeccable live-server stop --keep-inject` reported `Stopped live server on port 8400.` The application preview at port 4322 remains running and available.
- No temporary injected source files were created; page-only script/title/overlay state was removed by fresh navigation. Review artifacts intentionally remain. The review tab ends at Editorial Lunch, 375×812, without injection.
- Screenshots: `review/technical-modern-focus-375.png`, `review/technical-editorial-375.png`; all manual computed and keyboard evidence: `review/browser-evidence-r1.json`.
- Questions skipped: delegated Assessment B only; the parent owns synthesis, priorities, and the user-facing close.
