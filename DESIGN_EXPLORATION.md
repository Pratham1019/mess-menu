# Design exploration — three directions

Status: proposed, not approved. This is a design decision document, not DESIGN.md or an implementation contract. No application UI has been coded.

Based on AGENTS.md, PRODUCT.md, DESIGN_BRIEF.md, the live-source research in [RESEARCH.md](RESEARCH.md), and Impeccable's Operate/planning guidance.

## 1. What the interface must solve

A student opens the page on a phone, usually to decide where to eat soon. The selected meal, date, three mess identities, and food should be understandable immediately. Menu text is the primary content; the product's personality comes from composition and typography.

Observed Thursday lunch lengths are 10 FC1 entries, 10 FC2 entries, and 6 Sindhi entries. Entries include long names, source uppercase, and phrases containing commas. Equal-length placeholder lists would conceal the actual layout problem.

The core challenge is balancing full-size reading against comparison density. Three narrow mobile columns would force excessive wrapping or smaller text. All three proposals keep a vertical mobile reading path and expose complete menus without carousels or collapsed sections. They differ in how identity, items, and metadata share the available width.

Research also changes the visual brief: source certainty must be legible. “Rotating schedule” and “Checked at …” convey different facts and must not be merged into a decorative freshness badge.

## 2. Shared decisions proposed for all directions

- Begin at 375px; adapt explicitly to 320 and 430px. Use 16px outer gutters at 375px, reducing to 12px at 320px if needed.
- A compact top area carries a small product identifier, the calendar date, and a full-width two-choice Lunch / Dinner control. Aim for the first menu text within roughly 140–160px; this is a design target pending an actual screen.
- Keep mess order FC1, FC2, Sindhi stable. Do not promote one source because it refreshed more recently.
- Full menus remain open. Do not introduce an overview followed by a “show full menu” tap or repeat the dishes in separate summaries.
- Body text 16px with approximately 23–24px line height. Metadata 14px/20px and sufficiently contrasted. Controls at least 44px high.
- Use semantic lists, one page heading, and a heading for each mess. Real fallback links support meal selection without JavaScript; progressive enhancement can make the switch instant.
- The visible meal selection persists until the user changes it. Do not switch meals underneath someone reading. Announce a selection change concisely to assistive technology.
- Use the source order. Render verified source sections when available, but do not invent “Mains,” “Sides,” or “Specials” to make the other sources look symmetrical.
- Source links are identifiable text links near their mess. Freshness is plain text with an actual timestamp. A rotating schedule remains labelled even after a successful fetch.
- Keep all three mess headings and source links present through failures. Use a compact inline state in place of the affected menu, not an error overlay.
- Sindhi Sunday is “No service today,” based on the owner's clarification. It is separate from missing menu data. No breakfast/snack content is created for Sindhi.
- Long dish names wrap naturally; no ellipsis, line clamp, forced equal-height sections, or content clipping.
- Avoid uppercase UI labels. Preserve source text in the initial implementation; any case-only transformation of FC1's uppercase entries needs an explicit rule approved separately.
- Use one self-hosted family per chosen direction. No photography, icons, shadows, gradients, decorative surfaces, or entrance animation is needed.
- On desktop, all directions can become three aligned comparison columns. Change layout only when each column has a comfortable reading width, roughly at 960px or later, rather than squeezing three columns onto a tablet.

Color and font choices below are exploration candidates, not approved tokens. None implies an additional dark-mode feature.

## 3. Direction A — Daily Sheet

**Visual identity:** an independent campus daily reduced to a very usable menu sheet. Strong headings, open columns, a quiet warm ground, and decisive horizontal rules. It should feel confident and authored without becoming a poster.

**Structural thesis:** read a complete menu down a full-width list, then move to the next mess. The same left edge anchors mess heading, dish names, and source note. This gives the food the longest available line.

### Typography

[IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans), regular for dishes and medium/semibold for hierarchy. Its humanist detail adds character while retaining clear everyday text.

Proposed fixed scale: 28px/30px compact page heading or date emphasis; 24px/28px mess headings; 16px/24px dishes; 14px/20px metadata. Three working weights at most. No separate display font or monospace labels.

Boldness comes from weight and alignment, not oversized type above the menus.

### Color system

| Role | Candidate |
| --- | --- |
| Background | #F8F7F2 |
| Main ink | #20211E |
| Secondary text | #62635E |
| Accent | #A83222 |
| Dividers | #D7D6D0 |

The red accent marks the selected meal and interactive focus/link treatment. It does not color food categories or indicate that a menu is fresh. The neutral ground remains consistent across sources.

### Mobile layout and hierarchy

A compact date/meal header, then three open sections separated by one rule each. Within each section: mess name, supported schedule/date context, the ordered dish list, then a concise checked/source line. Keep a significant warning directly beneath the heading, above the food.

Items use consistent 24px baselines with little extra inter-item spacing; section spacing is about 20–24px. A source list should read as a menu, not as ten individual components.

No promise that all three complete menus fit on the first screen. At 375px, the priority is a clearly readable first menu and the beginning of the next; the rest follows in normal scrolling. Actual visibility must be measured with the full captured text after approval.

### Strengths and compromises

Best reading measure, clearest hierarchy, simplest semantics, and lowest layout risk with arbitrary source text. It tolerates long names and missing states well, particularly at 320px.

It uses more vertical space than the compact alternative. Comparing FC1 and Sindhi requires scrolling; stable section rhythm must make that movement easy. Familiar editorial structure is an intentional tradeoff, so spacing, weight, and rules must be unusually precise.

**Impeccable critique:** strong for the primary reading task. Watch the top heading: it must remain a utility header rather than expanding into a hero. Do not add ornamental issue numbers or newspaper furniture.

## 4. Direction B — Comparison Ledger

**Visual identity:** a concise printed reference ledger. Dense horizontal records, clear boundaries, and precise data typography. It aims to put more of the three choices into one glance.

**Structural thesis:** each mess becomes a compact record whose dishes run as an inline semantic list, with distinct separators between source entries. Information is compressed by layout, not by reducing font size or removing food.

### Typography

[Geist](https://fonts.google.com/specimen/Geist), regular and semibold. Its compact, even texture supports short records and controls. Tabular numerals may be used for times, without adding a second family.

Proposed fixed scale: 24px/28px heading, 20px/24px mess identity, 16px/24px menu text, 14px/20px metadata. A tight range makes the record structure more important than a large display heading.

### Color system

| Role | Candidate |
| --- | --- |
| Background | #FAFAFA |
| Main ink | #20242C |
| Secondary text | #606670 |
| Accent | #214DB7 |
| Dividers | #D5D9E0 |

Blue is reserved for selection, links, and focus. Stronger neutral rules organize the records; no alternating colored row fills.

### Mobile layout and hierarchy

A narrow top area, then FC1, FC2, and Sindhi records. Each record begins with the mess heading and source context on separate readable lines. Below, dishes flow across the full width with a clear middle-dot separator between list entries. Commas inside a source entry remain part of that entry; they are not used to infer separate dishes.

Keep source-defined groups as their own lines when present. Do not visually flatten Sindhi's categories if that would discard meaningful source information. This means density varies by source.

The meal control uses a compact rectangular split treatment, not pills. Every record ends with its checked/source information. All text remains open.

### Strengths and compromises

Potentially the shortest scroll, with the best chance of seeing all three mess identities near the first screen. The compactness can work well for daily repeat visits.

Finding one particular dish is harder in a continuous text run. Long or compound names reduce the density advantage, and Sindhi's source sections make records less uniform. Separator design must remain unambiguous, particularly with FC1's uppercase text. Screen-reader list semantics must survive the inline styling.

**Impeccable critique:** competitive for fast broad comparison, weaker for careful dish reading. Reject it if real text becomes a wall of words at 320px. Do not justify smaller type with the word “density.”

## 5. Direction C — Margin Index

**Visual identity:** a carefully indexed reference page. Mess identities occupy a clear marginal rail while dish lists form the main reading column. A purposeful forest-green accent and restrained public-information typography give it a calm utility character.

**Structural thesis:** separate where the food is from what the food is. Repeating alignment across messes lets a reader locate a source quickly while scanning down the food column.

### Typography

[Public Sans](https://fonts.google.com/specimen/Public+Sans), regular and semibold. Its open, practical forms suit a public-information utility, while the rail creates the distinctive composition.

Proposed fixed scale: 28px/32px top heading; 22px/26px mess names; 16px/24px dishes; 14px/20px metadata. Source names are typographic anchors, without invented ordinal numbers.

### Color system

| Role | Candidate |
| --- | --- |
| Background | #F4F6F3 |
| Main ink | #19221C |
| Secondary text | #5D685F |
| Accent | #256342 |
| Dividers | #CDD5CE |

Green carries selection and links, never a “healthy food” judgment or a freshness guarantee. Everything else stays in the neutral scale.

### Mobile layout and hierarchy

At 375px, use a roughly 64px mess rail, a 12px gap, and the remaining approximately 267px for food. FC1/FC2 fit naturally; Sindhi wraps only if necessary rather than becoming an unexplained abbreviation. Full-width rules separate messes. Source/freshness information spans the full width beneath each record, keeping 14px text out of a cramped rail.

At 430px, expand the reading column while keeping the rail compact. At 320px, move the mess label above the dish list; retaining a rail there would narrow the measure unnecessarily. At larger sizes, the same aligned index logic can become the headers of three comparison columns.

### Strengths and compromises

Most distinctive composition of the three and very clear source ownership. Stable alignments suit repeat scanning and graceful mixed source states.

The rail reduces dish width at the primary 375px size. Long names wrap more and increase scroll height. The 320px adaptation loses some of its signature arrangement, and source metadata needs careful placement to avoid an overbuilt table.

**Impeccable critique:** precise and restrained, but its visual signature consumes useful reading width. The rail must earn that space in a real text comparison with Direction A.

## 6. Side-by-side judgment

These are qualitative design judgments, not user-testing scores.

| Criterion | Daily Sheet | Comparison Ledger | Margin Index |
| --- | --- | --- | --- |
| Individual dish readability | Strongest | Weaker for long lists | Strong, but narrower |
| Comparison density | Moderate | Strongest potential | Moderate |
| Resilience at 320px | Strongest | Text-run risk | Requires structural collapse |
| Distinctive identity | Typographic | Dense and systematic | Strongest composition |
| Variable source formats | Strongest | Source grouping reduces uniformity | Good |
| Implementation complexity | Lowest | Low; semantics require care | Modest responsive layout work |

The difference is structural: full-width vertical lists versus compact inline records versus an identity rail. A palette swap alone would not create these alternatives.

## 7. Recommendation

**Choose Direction A: Daily Sheet.**

It best meets the ranked brief: menu readability first, then hierarchy and mobile usability. It also handles the actual sources without inventing shared categories, concealing full menus, or building custom interaction.

Its craft should come from three decisions executed carefully: an unmistakable but compact meal selection, strong mess names on a consistent baseline, and tightly set full-width dish lists with honest source context. Warm neutrals and restrained red give it a clear voice without competing with the food.

Use Direction B only if, after seeing real captures, the owner values first-screen density enough to accept the loss of item-by-item scanning. Direction C is the alternative if the indexed composition proves worth its narrower text column.

Approval of a direction will allow a dedicated DESIGN.md to record its refined tokens, components, and responsive rules. No design direction has been silently selected for implementation.

## 8. Design verification boundary

Calculated WCAG relative-luminance contrast for proposed text colors on their stated backgrounds:

| Direction | Main text | Accent text | Secondary text |
| --- | --- | --- | --- |
| Daily Sheet | 15.09:1 | 6.23:1 | 5.65:1 |
| Comparison Ledger | 14.90:1 | 7.16:1 | 5.54:1 |
| Margin Index | 15.02:1 | 6.57:1 | 5.35:1 |

These specific pairs exceed 4.5:1. This is a palette calculation, not a full accessibility certification; interactive boundaries, focus treatments, and any future inverse-text control still need their own checks. Divider colors are not intended as essential control boundaries.

No application mockup screenshots or usability results are claimed. The inline comparison accompanying this document is a presentation board of type, palette, and layout logic, not an implemented product screen. The implementation must later be checked at 320, 375, and 430px using the actual menu captures, including the long FC2 item and source-uppercase FC1 text.

## 9. How Impeccable informed the work

Applied Operate-mode guidance: one family can carry the utility; fixed readable sizes; standard meal controls; state words rather than ornamental badges; density and consistent alignment before novelty. Used its exploration prompts to pressure-test structural variety.

Additional metaphors considered included a transit diagram, a monochrome marketing page, a cassette tracklist, an orienteering map, a vertical media feed, and a split-flap timetable. Their literal navigation, imagery, motion, or one-item-at-a-time behavior conflicts with this brief or the audience's task. The useful disciplines are stable alignment, unambiguous states, and complete lists; none justifies importing decorative maps, marketing proofs, flips, or forced paging. The owner's requested three directions and no-implementation boundary govern the deliverable.

Impeccable also reported that PRODUCT.md lacks its optional current product-record metadata/schema. The supplied product specification is sufficient for this research. A later explicit Impeccable init can enrich that metadata; it has not been rewritten from inference.

## 10. Approval boundary

The next decision is which of these three directions to pursue, or what to revise. Stop here for the owner's approval. Source ingestion, the persistent cache, the Astro project, and UI components are still proposals.

