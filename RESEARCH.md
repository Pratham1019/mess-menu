# Source research and architecture proposal

Research date: 22 October 2026. Live HTTP and browser observations were made approximately 11:33–11:41 UTC (17:03–17:11 IST). This is a point-in-time inspection, not an uptime or accuracy guarantee.

Status: the source investigation below is historical point-in-time evidence. Isolated design prototypes now exist; production ingestion, infrastructure and deployment remain unimplemented. See the four-meal correction at the end for the current scope.

## 1. What was inspected

Read AGENTS.md, PRODUCT.md, and DESIGN_BRIEF.md in full. Used Impeccable 4.7.0 context, shape/new-work planning, and Operate guidance. The visitor's task is to read and compare lunch or dinner quickly; expression should come from type, alignment, and density.

For each provided source, fetched the live page and inspected its rendered browser state at 375 × 812 CSS pixels. Inspected loaded JavaScript/data assets, actual browser requests, linked API documentation, and linked public repositories. Queried only endpoints discovered in those assets or published documentation. No speculative API-path enumeration, source modifications, or contact with maintainers.

Evidence is saved under [research/evidence](research/evidence/README.md). Live source screenshots are under research/screenshots. These are screenshots of the existing sources, not proposed application screens. Web search extraction was insufficient: it failed on some live endpoints and returned older prerendered Sindhi content. Direct HTTP responses and the live browser were used to resolve that discrepancy.

## 2. Findings at a glance

| Source | Verified ingestion option | Date coverage observed | Freshness actually established | Main uncertainty |
| --- | --- | --- | --- | --- |
| FC1 | Week menu embedded in the JavaScript asset referenced by its HTML; no public menu API discovered | Wednesday 21 OCT through Tuesday 27 OCT; year absent in FC1's date fields | Asset deployment metadata and a static updated flag; no menu publication or verification timestamp | Stable extraction contract and authoritative year |
| FC2 | Documented JSON API on tikm.coolstuff.work; live viewer also reads a static JSON bundle | Explicit ISO dates 2026-10-19 through 2026-10-25 | Successful retrieval of a dated weekly schedule; no content-update timestamp in the inspected response | Publication cadence, API limits, and future-week selection |
| Sindhi | Documented /api/menu JSON endpoint; four public rotation documents | API projects 2026-10-19 through 2026-10-24 using menu3 | Response generation time, not verification of food actually served | Rotation adherence and date of the banner's last revision |

None of the three inspected sources establishes that each meal has been independently confirmed as served. Use “Published schedule,” “Source date: 22 Oct,” or “Rotating schedule” as supported, rather than “Confirmed” or an unexplained “Live.”

Product-owner clarification during research: **Sindhi provides lunch and dinner Monday–Saturday, no breakfast or snacks on any day, and no service on Sunday.** The source's six-day data corroborates its coverage; the conclusion that Sunday has no service comes from the owner, rather than from an absent API key alone.

## 3. FC1 — Bluspring

### Verified URLs and mechanism

- [Provided website](https://bluspring.vercel.app/)
- [Weekly viewer](https://bluspring.vercel.app/weekly), discovered in the rendered page.
- [JavaScript asset inspected](https://bluspring.vercel.app/assets/index-CzZolopw.js), discovered in the initial HTML. This filename is deployment-specific, not a stable endpoint.
- The initial HTML returned HTTP 200 and was 1,781 bytes. It contains a root element and the application script rather than server-rendered menu text.
- The script was 290,359 bytes. Its FC1 menu is a literal object, selected by a mess configuration entry with key “Food Court-1” and fullLabel “Food Court - 1 (MIT).”
- No menu fetch/XHR was observed during initial rendering. The bundle includes the menu itself; its sole fetch call found in this asset is the module-preload helper. This supports an embedded-data adapter, **not a claim that no other API exists anywhere**.
- No source repository or API documentation was linked from the page inspected. A bounded web search did not identify a verifiable repository for this particular site.

### Actual format

A weekday-keyed object, with date, Breakfast, Lunch, Snacks, and Dinner. Each meal has time, note, and items. Items are objects with name and type; observed types include veg and nonveg.

FC1's seven raw date labels are 21st-OCT, 22nd-OCT, 23rd-OCT, 24th-OCT, 25th-OCT, 26th-OCT, and 27th-OCT. They contain no year. Other messes in the same asset have full numeric dates; those dates do not automatically establish FC1's year.

For the Thursday entry, the observed source schedule is:

| Meal | Source time string | Items |
| --- | --- | --- |
| Lunch | 12:00 PM - 2:00 PM | 10 |
| Dinner | 7:30 PM - 9:30 PM | 9 |

Examples preserved exactly include “LAUKI CHANNA KOOTU,” “METHI MUTTER MALAI,” and “HARLIYALI EGG.” Spelling and composite entries are source material, not errors to silently rewrite or split.

### Freshness and date traps

The page's HTTP Last-Modified was 2026-10-21T07:23:29Z during inspection. This is deployment/asset metadata, not proof of when someone checked the menu. The mess configuration contains isUpdated: true and notifyIfNotUpdated: true, both static flags.

The viewer derives displayed dates from the viewer's current calendar and a Wednesday-first week. It uses local getDay/getHours rather than an explicit IST time zone in the inspected code. In the research browser, whose time zone was UTC, lunch was described as “Up Next” even though IST was already after the source lunch window. **Do not scrape its relative status or computed visible date as authoritative menu dates.**

Treat 22nd-OCT as a partial source date. A proposed adapter may resolve a year only under an explicit, narrow rule: match the complete seven-day sequence, weekday alignment, and a date window near a newly observed deployment. Record the inferred year separately from the original label and mark its provenance. If the match is ambiguous, expired, or unchanged over a later year boundary, show “Date not verified” or “Menu not updated,” not today's menu. A stable feed with full dates would remove this uncertainty.

### Recommended ingestion approach

Prefer obtaining a documented JSON/feed contract from the maintainer before production. No such contract is assumed to exist.

A fallback is technically feasible without a browser: fetch the HTML, discover the current same-origin script, parse its syntax, locate the mess entry structurally, resolve its data literal, and validate it. Never depend on a particular minified variable name or asset hash. Never eval the downloaded script. A small JavaScript parser would be a justified server dependency if this fallback is accepted.

A change in asset structure must fail only FC1 and preserve its last valid snapshot. Do not substitute WGSHA, Aradhana, NIH, or MAHE menus merely because they share this bundle.

## 4. FC2 — The Indian Kitchen

### Verified API and live behavior

The [provided website](https://tikmit.com/) links to [API reference](https://tikm.coolstuff.work/docs/reference), whose configuration points to [OpenAPI JSON](https://tikm.coolstuff.work/openapi.json).

The downloaded specification identifies “FC2 Menu API” v2.0.0. It documents GET /api/menu, /api/history, /api/jain-menu, and /api/jain-history. Read requests tested here required no authentication. Jain selection is outside the requested MVP.

Verified requests:

| URL | Result |
| --- | --- |
| https://tikm.coolstuff.work/api/menu?date=2026-10-22&v=2 | 200; one dated day, Food Court 2 |
| https://tikm.coolstuff.work/api/menu?v=2 | 200; week October 19–25, 2026 |
| https://tikm.coolstuff.work/api/history?v=2 | 200; weeks array with startDate/endDate |
| https://tikm.coolstuff.work/api/menu?date=2026-10-26&v=2 | 404; error “No menu available” |

The absent 26 October result demonstrates the missing-date path at inspection time. It does not establish future publication timing.

Browser requests showed that tikmit.com currently loads [manifest.json](https://tikmit.com/data/menu-bundle/manifest.json), then the referenced [current weekly bundle](https://tikmit.com/data/menu-bundle/normal/2026-10-19-0b94477250b0.json). The live API and this weekly JSON were structurally equal in the captured responses.

### Actual format

Top-level foodCourt, week, and menu. The menu is keyed by ISO calendar date. Each day has day and meals; each meal has name, startTime, endTime, items, and allergens.

Version 2 items are objects with name and tags; version 1 is documented to return strings. Tags seen include non-veg and non-veg-special. Empty tags are not proof of a dietary classification, and empty allergens are not proof of allergen safety. Preserve supplied metadata without inventing classifications.

The inspected Thursday lunch has 10 entries, 11:45–14:15. Dinner has 10, 19:00–21:30. “Maharashtrian Kadi Pakoda” and “Channa Pulav, Beetroot Raitha” are examples of realistic long/composite entries the layout must accommodate.

### Freshness

The inspected API responses had Cache-Control: no-store, max-age=0 and Access-Control-Allow-Origin: *. No source-updated timestamp was present in the captured menu payload; history summaries also lacked one.

The static manifest's generatedAt was 2026-10-20T03:27:04.547Z. Its current entry had lastModified: null. The weekly hashed asset is served immutable; the manifest is revalidated. The bundle's HTTP Last-Modified differed from its manifest generation time, further demonstrating why these timestamps should retain their separate meanings.

Prefer the live API with an explicit target date or week. Never equate the default/latest response with today's date: it may eventually contain a future publication. The source viewer's own date-selection code checks whether a week covers today and has fallback behavior. Our product should show a dated unavailable state rather than silently relabel a past/future schedule.

The static bundle can be a secondary source of the same schedule during API failure, if discovered through the manifest and validated for the requested date. Label its provenance and bundle generation time.

### Repository inspected

[Public repository](https://github.com/aaditagrawal/fc-menu), commit e709e677c4a97fcfb8348780157b3bfd23b9eed2.

Relevant files are src/data/weeks/index.ts, src/lib/staticMenuBundle.ts, and scripts/build-menu-data.mjs. They confirm the live API and build-generated bundle paths. Repository HEAD is supporting evidence; it must not be assumed to be exactly the code currently deployed.

## 5. Sindhi

### Verified URLs and behavior

- [Provided website](https://sindhi.coolstuff.work/)
- [OpenAPI JSON](https://sindhi.coolstuff.work/openapi.json), linked by the page.
- [Current API](https://sindhi.coolstuff.work/api/menu), documented and verified with HTTP 200.
- [menu3.json](https://sindhi.coolstuff.work/menu3.json), observed as a browser request and returned by the API's source field.
- The public repository contains menu1.json through menu4.json; the live browser selected menu3 for the research date.

The source explicitly warns that Sindhi sometimes does not adhere to its menu. The initial HTML/search extraction contained September 28/menu4 content; the browser recalculated October 22/menu3 and fetched menu3.json. Use the API rather than scraping the prerendered homepage.

Some initial Python requests with its default client identity returned 403. Subsequent HTTP requests and browser fetches succeeded. A final server request with the honest User-Agent “MIT-Mess-Menu-Research/0.1” also returned 200. Access should still be checked from the eventual Vercel deployment; availability from this environment is not an SLA or an instruction to bypass access restrictions.

### Actual API format and dates

Captured metadata:

| Field | Observed value |
| --- | --- |
| id | 2026-10-19_to_2026-10-24 |
| generatedAt | 2026-10-22T11:35:55.080Z |
| source | /menu3.json |
| week | Oct 19 – Oct 24 • menu3 |

The menu object is keyed by weekday names, Monday–Saturday, not ISO dates. Each day has day, displayDate, and lunch/dinner meals. Meals contain name, startTime, endTime, items, and sections.

Sections observed include nonVeg, veg, and vegSides. The published enum omits vegSides even though the live API returns it: runtime validation must account for the observed contract drift without discarding those dishes. Preserve unknown future section kinds as generic source-labelled sections, or report a scoped parse failure if their structure is invalid.

The underlying JSON is less normalized: veg/nonVeg/vegSides can be strings or arrays. The source builder splits comma/newline/semicolon-delimited strings and preserves others. Do not duplicate an API's flat items and sections, since they represent the same food.

Thursday lunch and dinner each have six flat entries. Lunch is 11:30–14:15; dinner 19:00–21:30. The complete capture is archived.

### What generatedAt means

The linked repository's worker/index.ts sets generatedAt to the time the request is handled. Its menuManager.ts selects a four-week cycle anchored on Monday 13 October 2025 as menu2; menuFile.ts projects weekdays onto the current IST week.

A second browser request returned a newer generatedAt with the same schedule, consistent with that code. Thus generatedAt is response generation, not a banner revision, current-meal confirmation, or evidence of recent manual review.

The rotation and menu text can remain unchanged while all rendered dates advance. Store the selected rotation identifier, original response metadata, and content hash. Use “Rotating schedule · may change” plus “Checked at …”; never “Updated just now” from generatedAt alone.

### Availability and Sunday

The API and all four repository rotation files cover Monday–Saturday lunch and dinner. The owner separately confirmed no breakfast/snacks on any day and nothing on Sunday. Encode that service rule separately from API availability:

- Sunday: “No service today.” Do not display Saturday's or the next Monday's food.
- Monday–Saturday absent lunch/dinner data: “Menu unavailable” or “Not published,” as supported by the response.
- Breakfast/snacks are outside the MVP and must not be synthesized for Sindhi.

[Repository inspected](https://github.com/aaditagrawal/sindhi-menu), commit f1222d3708f48ba81e29ddc9ac015d02cdea43d2. The live API behavior and its linked code agree on the projection mechanism; deployment-to-commit equivalence is not claimed.

## 6. Data contract and honest freshness

Proposed normalized contract, not implemented code:

| Field group | Required meaning |
| --- | --- |
| Identity | mess identifier; meal lunch/dinner; requested ISO date; Asia/Kolkata |
| Source date | original date label/key; resolved full date if justified; date basis explicit / inferred-year / rotation-projection / unknown |
| Menu | ordered item text; optional source tags and source sections; source time window if supplied |
| Availability | available / no-service / not-published / unavailable / invalid |
| Provenance | source page URL, fetched URL, response/bundle/rotation identifier, optional HTTP validators and content hash |
| Freshness | lastAttemptAt, lastCheckedAt for successful retrieval/revalidation, retrievedAt for the last successfully received validated body, lastContentChangeObservedAt, sourcePublishedAt if actually supplied, sourceGeneratedAt where applicable |
| Retrieval condition | current snapshot / cached after error / older than refresh policy; independent of whether the meal date is applicable |

sourcePublishedAt remains null for the inspected responses. A 304 can advance lastCheckedAt after successful revalidation, but does not change the original content receipt or publication timestamp. First observation is not proof of when the source changed.

Keep date applicability, retrieval freshness, and certainty separate. A recently fetched old-week menu is expired; a week-old schedule successfully checked today may still apply. A freshly generated Sindhi response is still a rotation prediction.

Suggested initial operational policy, subject to approval:

- Attempt refresh per source after 15 minutes of successful-check age, on traffic. Use a short retry backoff after failures rather than hammering a failed origin.
- Keep last valid snapshots for 14 days for diagnosis/fallback; never use that retention period as permission to relabel expired food.
- If refresh fails and cached data covers the requested date, show that snapshot with its last successful check and an explicit cache warning.
- If the cached snapshot is over 24 hours since a successful check, use “Not checked recently” as well as its actual time. This is a proposed freshness threshold, not a source fact.
- If no applicable menu exists, show the mess heading, state, and source link. All three messes remain in stable order.
- For a known no-service day, show the service state even if the API is unreachable; it does not require inventing menu data.
- Keep source spelling and ordering. Avoid heuristic “mains/sides” categories for FC1/FC2, which do not provide comparable categories.

## 7. Simplest architecture that meets the resilience requirement

**Recommendation: one Astro application on Vercel, server-rendered HTML, three independent TypeScript adapters, and one small persistent key-value store for validated source snapshots.**

The Vercel Functions and storage guidance was consulted for server/runtime and persistence constraints. No resources were provisioned.

### Request and data flow

1. On the server, determine the calendar date in Asia/Kolkata. Use an explicit meal if selected; otherwise propose lunch until 14:15 IST and dinner afterward, keeping the calendar date until midnight. That default is a product rule to approve, not a claim that all mess windows are equal.
2. Read all three cached source records in one store round trip. Evaluate service rules and date applicability.
3. When a valid applicable snapshot exists, render it immediately and refresh due records after the response using Vercel's documented waitUntil helper. A short per-source refresh lock/backoff avoids duplicate origin work. When a snapshot is missing or inapplicable, fetch independently and concurrently within a bounded request budget: initially about three seconds per source pipeline, including FC1's HTML-to-asset dependency, and a short store timeout. On error use applicable last-good data; otherwise return a scoped unavailable state. Background refresh is best-effort, remains within function limits, and must not manufacture a successful-check time before it finishes.
4. Validate external payloads as unknown values, then normalize through pure adapter functions. A failure must not erase a valid cache record or block successful sources.
5. Render date, meal controls, source metadata, and the menu text into HTML. A visitor should not download upstream bundles or wait for client-side API fetching.
6. Return a complete page. Both meals may be present in the HTML, with a small native script progressively enhancing the switch. Real links remain the no-JavaScript fallback.

A persistent store is justified by one concrete requirement: last-good menu data must survive serverless cold starts and one-source outages. Process memory, a local JSON file, or HTML CDN caching alone does not provide independent durable source fallback. Recommend a single Upstash Redis store through Vercel Marketplace, using its small server SDK or documented REST interface. No relational database, ORM, queue, ingestion microservice, or dedicated browser service is needed.

Start with demand-driven refresh; periodic jobs are unnecessary for the MVP unless an agreed update-latency requirement or observed cold-start performance justifies them. Automatic aggregation then occurs without manual menu entry whenever traffic refreshes expired records. It does not promise that a dormant site fetches unseen source changes.

### Astro and delivery choices

- Use Astro's official Vercel adapter with on-demand rendering on Node.js. Strict TypeScript. Components remain .astro; no React/Vue/Svelte runtime is needed.
- Tailwind CSS v4 through the official @tailwindcss/vite integration, with a small approved CSS token set. The historical Astro Tailwind integration is unnecessary here.
- Suggested routes are / for the automatic meal choice and /lunch and /dinner for explicit choices. These are **proposed application routes**, not upstream endpoints. Render both meal panels from the same snapshot when useful; validate paths rather than accepting arbitrary fetch URLs.
- Initially render HTML per request from the shared cache, with browser no-cache. This avoids caching yesterday's date or the wrong automatic meal while the content remains tiny. Static CSS/fonts receive normal asset caching.
- Add short CDN HTML caching only after measurements justify it. If enabled, cap its complete fresh-plus-stale window at the next IST date boundary; the automatic root also needs a meal-cutoff cap. Never use an indefinitely cached ISR response for “today.”
- Astro's Vercel ISR mode has special search-param and expiration behavior. Avoid enabling it by default or assuming a query parameter forms a separate ISR page.
- Self-host one chosen Latin WOFF2 family, use only required weights or a subset variable file, font-display: swap, and metric-compatible fallbacks. Readable system text must appear before a custom font loads.
- Plain browser JavaScript is sufficient for meal switching and refreshing a long-open page at an IST date boundary. Keep no-JavaScript links functional. No service worker, app shell, analytics dashboard, or client data cache is required for this phase.

### Module boundaries proposed

| Area | Responsibility |
| --- | --- |
| ingestion/adapters | Source fetch/discovery; parse raw contracts; preserve provenance |
| ingestion/validation | Runtime checks for dates, shapes, bounded text/array sizes, and known mess identity |
| domain/menu | Common meal model, service availability, date applicability, freshness rules |
| server/snapshots | Persistent last-good reads/writes, refresh timing, failure isolation |
| pages/components | Semantic HTML, meal selection, source labels; no source-specific scraping logic |
| styles | Approved tokens and minimal responsive layout |

These are proposed boundaries, not files created in this phase.

### Dependency and performance discipline

Required core: Astro, TypeScript, Tailwind v4, its Vite plugin, and the Vercel adapter. Add the small @vercel/functions helper for background cache refresh, a runtime validator (or narrow well-reviewed type guards), one snapshot-store client if used, and a JavaScript parser only if the FC1 fallback is accepted. Keep all ingestion dependencies server-only.

Proposed budgets to measure after implementation: custom interaction JavaScript at most 3 kB compressed; CSS at most 10 kB compressed; one font subset targeted below 50 kB; no image payload needed for the core screen. These are targets, not measured results. Validate real transfer size and performance on an emulated mid-range Android/slow network after approval; no Lighthouse result is claimed.

### Alternatives considered

| Alternative | Benefit | Reason not recommended as the complete MVP |
| --- | --- | --- |
| Static Astro rebuilt on a schedule | Very cheap static delivery | Freshness/date rollover depend on successful builds; needs an external trigger and last-good ingestion persistence |
| Browser-only aggregation | Less server code | Client waterfalls, FC1 parsing, inconsistent CORS, and empty first paint |
| SSR with only a CDN cache | Fewer services | HTML cache is not an independently validated last-good store for each source |
| Production headless scraping | Can render FC1 | Adds latency and browser operational cost when embedded data is already accessible |
| Separate ingestion backend/database | More control | No demonstrated need at this size |

## 8. Uncertainties and decisions to carry forward

| Priority | Question | Evidence / next resolution |
| --- | --- | --- |
| High | Can FC1 provide a stable JSON feed and full meal dates? | No feed discovered; use a guarded literal adapter only if its maintenance tradeoff is accepted |
| High | How should FC1's missing year be treated in production? | Preserve partial labels; approve a narrow year-resolution rule or show an unverified-date state |
| High | How often is Sindhi's banner/rotation actually revised? | API timestamp is generated on read; no manual verification timestamp found |
| Medium | Do source operators permit the proposed refresh frequency; are there limits? | Public read endpoints worked, but no contractual quota or SLA was established |
| Medium | Are APIs reachable with normal server requests from the chosen Vercel region? | Worked here; verify after an explicitly approved preview deployment |
| Medium | Is 15-minute demand-driven refresh sufficient? | Suggested to balance latency and source load; no publication cadence guarantee |
| Medium | Which Vercel plan/store region and budget should be used? | Not provisioned; confirm at implementation/provisioning time |
| Medium | Does lunch until 14:15 suit the primary journey? | Proposal only; source service windows remain separate |
| Medium | How should unusually long source items/casing appear? | Preserve raw values; approve any case-only display transformation explicitly |

Sindhi's Sunday/service coverage is settled by the owner's clarification and is no longer an uncertainty.

## 9. Verification performed and deferred

Performed: three live page inspections; mobile source screenshots at 375px; HTTP status/header inspection; FC1 asset and date inspection; FC2 API/schema/history and bundle comparison; a documented absent-date request; Sindhi API/rotation and repository inspection; repeated Sindhi response timestamp comparison; initial text/accent palette contrast calculations in the design exploration.

Not performed: application tests, mobile usability testing of our application, a production reliability study, source-owner confirmation, performance benchmarking, or deployment. There is no application to test yet.

After a direction is approved, inspect the implementation at 320, 375, and 430px before desktop, using real source text, long labels, one failed source, cached data, expired dates, and Sindhi Sunday. Check no horizontal overflow, 200% zoom, keyboard behavior, focus visibility, 44px touch targets, meal switching, and the no-JavaScript fallback. Execute TypeScript/Astro/build checks and meaningful adapter/date/failure tests then.

## 10. Primary references

- [Bluspring live page](https://bluspring.vercel.app/) and its linked deployment asset, inspected directly.
- [FC2 API documentation](https://tikm.coolstuff.work/docs/reference), [OpenAPI contract](https://tikm.coolstuff.work/openapi.json), and [live manifest](https://tikmit.com/data/menu-bundle/manifest.json).
- [FC2 API client at inspected commit](https://github.com/aaditagrawal/fc-menu/blob/e709e677c4a97fcfb8348780157b3bfd23b9eed2/src/data/weeks/index.ts).
- [Sindhi API contract](https://sindhi.coolstuff.work/openapi.json) and [live API](https://sindhi.coolstuff.work/api/menu).
- [Sindhi response generation](https://github.com/aaditagrawal/sindhi-menu/blob/f1222d3708f48ba81e29ddc9ac015d02cdea43d2/worker/index.ts), [rotation calculation](https://github.com/aaditagrawal/sindhi-menu/blob/f1222d3708f48ba81e29ddc9ac015d02cdea43d2/src/lib/menuManager.ts), and [date projection/sections](https://github.com/aaditagrawal/sindhi-menu/blob/f1222d3708f48ba81e29ddc9ac015d02cdea43d2/src/lib/menuFile.ts).
- [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/) and [official Vercel adapter, including ISR constraints](https://docs.astro.build/en/guides/integrations-guide/vercel/).
- [Tailwind v4 with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro).
- [Vercel cache header behavior](https://vercel.com/docs/caching/cache-control-headers).
- [Vercel waitUntil and function lifetime](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package#waituntil).
- [Upstash's documented HTTP storage interface](https://upstash.com/docs/redis/features/restapi).

Design proposals and the recommendation are in [DESIGN_EXPLORATION.md](DESIGN_EXPLORATION.md). No direction is approved and DESIGN.md has not been created.



## Four-meal prototype correction (owner update)

The original lunch/dinner scope has been superseded in PRODUCT.md. Existing captured evidence supports FC1 and FC2 Breakfast, Lunch, Snacks and Dinner. No new menu endpoint was guessed or queried for this prototype round. Both replacement prototypes use frozen Thursday 22 October research fixtures.

| Meal | FC1 observed time / item count | FC2 observed time / item count | Sindhi |
| --- | --- | --- | --- |
| Breakfast | 07:00–09:30 / 11 | 07:00–09:30 / 11 | Not served; omit |
| Lunch | 12:00–14:00 / 10 | 11:45–14:15 / 10 | Selected Menu 1 |
| Snacks | 16:30–17:45 / 4 | 16:30–18:00 / 4 | Not served; omit |
| Dinner | 19:30–21:30 / 9 | 19:00–21:30 / 10 | Selected Menu 1 |

Breakfast examples include FC1’s source `PANEER MINT PARATHA` and `HOT MILK ,BOURNVITA`, and FC2’s `Onion Utthappam` and `Cornflakes with Cold Milk`. Snacks include FC1’s `RIBBON SLICE CAKE` and FC2’s `Kacchi Dabeli (1 PC)`. See fc1-menu-literal.txt and fc2-menu-2026-10-22.json in research/evidence for the full, unchanged source lists. Presentation case and comma spacing are normalized in the new prototypes; spelling and composite entries are retained. Case is not evidence of dish importance. FC1’s source year remains unknown.

Sindhi service availability comes from the owner: Lunch/Dinner Monday–Saturday only, no Sunday service. Unsupported meals and independent retrieval failures are different states.
