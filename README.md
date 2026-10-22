# The mess

Fast, server-rendered FC1, FC2 and Sindhi mess menus for MIT Manipal. Astro, strict TypeScript and Tailwind v4; no client framework. All four meals arrive together, with a small script for instant switching and a service worker for device caching. Human-readable dates omit years; data retains full ISO dates.

## Local development

Use Node 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
npm run test:integration
```

Open http://localhost:4321. The root application is production code. `prototype/` and `design-prototypes/` are historical, isolated design studies; they are not routed or included in the root build. Set the Vercel project's Root Directory to this repository root.

## Admin setup

Read [the security design and environment-variable requirements](docs/SECURITY.md) first. `/admin` is private; there is no registration or public admin link. Authentication uses Node scrypt and stateless HMAC-signed cookies.

1. Run `npm run admin:hash` in your own terminal. Enter and confirm a strong password at the hidden prompts. Save the resulting hash as `ADMIN_PASSWORD_HASH` in Vercel, including all `$` separators. Do not put passwords in command arguments or chat.
2. Generate `ADMIN_SESSION_SECRET` with `openssl rand -hex 32` in your own terminal. Store it as a Vercel secret; do not commit it. Rotating the hash or secret invalidates all sessions.
3. Set `ADMIN_ORIGIN` to the exact HTTPS origin used to access the editor, without a trailing slash. Configure Preview and Production separately; do not use wildcard origins.
4. Connect a **private** Vercel Blob store and set `BLOB_READ_WRITE_TOKEN` server-side. Separate production and preview stores are recommended.
5. Publish a Vercel Firewall SDK rule using `@vercel/firewall` as its condition and the ID in `ADMIN_LOGIN_RATE_LIMIT_ID`. Set 5 requests per 600 seconds, per IP, with a rate-limit/429 action. Expose Vercel system variables. For protected previews also enable Protection Bypass for Automation so the SDK can reach its rule; Vercel supplies `VERCEL_AUTOMATION_BYPASS_SECRET`. A missing rule or unavailable shared limiter disables sign-in. There is no in-memory or development bypass.
6. After an explicitly authorized Preview deployment, execute the deployment acceptance checks in `docs/SECURITY.md`, including a real sixth login attempt and a save/restore against Blob. This repository has not been deployed by this task.

The public site works locally without secrets by reading live sources. Admin login deliberately requires Vercel's shared rate limiter; local tests substitute infrastructure at the test boundary. Admin cookies are always Secure, including in development. Use local HTTPS for browser-based admin development with infrastructure supplied separately.

## Data behavior

Each source is fetched and validated separately. Successful snapshots are cached in private Blob for 60 seconds; on source failure, a dated cached snapshot up to seven days old can be shown with an explicit cached warning and its original retrieval time. No fixture is silently reused as live data. Without Blob, aggregation still works but has no persistent fallback.

FC2 uses its dated JSON API. Sindhi uses its generated weekly rotation, with independent Monday–Saturday Lunch/Dinner eligibility. FC1's current same-origin script is discovered from its HTML and parsed with Acorn; downloaded code is never executed. Its missing year is inferred only when a recent deployment and all seven dates/weekday alignments establish one unambiguous week. Otherwise FC1 is unavailable. Changed source structure fails only that source.

On entry, select the current/upcoming meal in IST using the latest eligible serving end. At the exact dinner cutoff, fetch **the next day's breakfast**, with its real date. Missing tomorrow data stays unavailable. Explicit `?meal=lunch&date=YYYY-MM-DD` links override automatic selection. The page never switches while someone is reading. All four meals are rendered in the initial response; switching changes visible panels and the URL instantly, makes no network request, and returns to the beginning of the page. Arrow keys, Home/End, browser history and native links are supported. Without JavaScript, meal links continue to work as normal server-rendered pages. Source links and routine retrieval strips are omitted from the public layout at the owner's request; provenance remains in storage, and last-check times appear only for stale cached menus.

## Device cache

The public reader registers `/sw.js` over HTTPS (also supported on localhost). It saves the already-loaded day without fetching the menus again, plus the public stylesheet and fonts. It keeps at most three dated pages, expires them after 48 hours, and bounds cached assets. Browsers may evict device storage; blocked storage does not break the reader.

Navigation refreshes from the network first. On failure or an eight-second timeout, the saved day opens with an explicit notice; all four meals remain available offline. Dates are never relabelled. After the dinner cutoff, an automatic offline visit uses the next day's real cached page or an honest unavailable state with a link to the previously saved date. Admin pages, login responses, POST requests and credentials are excluded. Saving admin changes is still a server action; public readers see them on their next successful online page load.

Admin saves create one dated override per mess and meal; they do not alter external sources or other days. Restoring removes that override. Single-admin edits use last-write-wins semantics if two tabs save simultaneously. Blob reads bypass CDN caching, so a completed save is visible on the next request.

`test:integration` runs against the last production build and substitutes only external HTTP services. Run it after `build`. The runtime application has no test login route, test credentials, or rate-limit bypass. The `path-to-regexp` override updates the Vercel adapter's transitive routing utility to its patched compatible release; `npm audit` verifies the resolved tree.
