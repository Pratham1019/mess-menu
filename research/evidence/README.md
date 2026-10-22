# Inspection evidence

Captured from the public sources on 22 October 2026 during approximately 11:33–11:41 UTC. These are research snapshots, not application fixtures to silently reuse as current menu data.

## Files and origin

| Capture | Origin / meaning |
| --- | --- |
| fc1-homepage.html.txt | https://bluspring.vercel.app/ — script URL discovery |
| fc1-deployed-bundle.js.txt | https://bluspring.vercel.app/assets/index-CzZolopw.js — raw public deployment asset, stored as text and not executed |
| fc1-menu-literal.txt | FC1's literal data excerpt from that asset; observed 21st-OCT through 27th-OCT with no year |
| fc2-menu-2026-10-22.json | https://tikm.coolstuff.work/api/menu?date=2026-10-22&v=2 — actual one-day response |
| fc2-week-2026-10-19.json | https://tikm.coolstuff.work/api/menu?v=2 — actual week response |
| fc2-openapi.json | https://tikm.coolstuff.work/openapi.json — discovered through linked API reference |
| sindhi-week-2026-10-19.json | https://sindhi.coolstuff.work/api/menu — actual generated rotation response |
| sindhi-rotation-menu3.json | https://sindhi.coolstuff.work/menu3.json — rotation document observed in browser requests |
| sindhi-openapi.json | https://sindhi.coolstuff.work/openapi.json — linked contract; its enum omits the observed vegSides value |
| *-headers.json | HTTP response metadata; Date is a response time and Last-Modified is not automatically a menu revision |
| sha256.json | Hashes for the captured data/header files, generated during archival |

FC2's API week was compared structurally with the JSON file referenced by its live manifest; the parsed objects matched. The source-only hashed bundle is still linked in RESEARCH.md. The dated 26 October query returned HTTP 404 and the body {"error":"No menu available"}; its absence is not a forecast of when publication will happen.

The three screenshots in ../screenshots show the live source pages at a 375 × 812 CSS-pixel viewport (captured PNGs have device-pixel dimensions 750 × 1624). FC1 was captured after selecting its default mess in that browser. They are not screenshots of a new app.

Repository support was inspected at FC2 commit e709e677c4a97fcfb8348780157b3bfd23b9eed2 and Sindhi commit f1222d3708f48ba81e29ddc9ac015d02cdea43d2. Source links in RESEARCH.md pin those commits. The repository checkouts are temporary research material outside this project; they were not installed as dependencies.

Sindhi's no-service Sunday rule is product-owner knowledge supplied during this session. Absence of Sunday from the API alone would not establish closure.
