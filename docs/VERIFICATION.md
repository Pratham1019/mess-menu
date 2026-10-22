# Verification

Executed on 22 October against the production root application.

- `npm run check`: no errors, warnings or hints.
- `npm test`: 15 passing security/data/device-cache test cases, covering multiple invalid inputs and time boundaries per case.
- `npm run build`: Vercel Node 24 server build passed.
- `npm run test:integration`: the actual built Vercel handler passed login, wrong password, missing shared limiter, sixth-attempt throttling, cookie attributes, protected pages/writes, origin/CSRF rejection, menu validation, save → public read → restore, HTML escaping, cached-source fallback, logout, and next-day breakfast at exactly 21:30 IST.
- `npm audit`: zero vulnerabilities.
- `git diff --check`: passed.

Integration tests mock only external HTTP services, including Vercel Firewall and Blob. Test keys are generated per run. The application has no test-auth route, test credentials, in-memory rate limiter, or production bypass. These checks do not certify a live Vercel rule or real Blob credentials. Follow the deployment acceptance checks in [SECURITY.md](SECURITY.md) after configuring infrastructure and explicitly authorizing deployment.

## Browser evidence

Used T3's collaborative Chromium browser, testing mobile before desktop. The initial implementation checked all four meals at 320, 375, 430, 768 and 1440 CSS pixels: 20 states. [Initial checks](browser-checks.json) record that earlier layout. After the owner requested removal of source strips, [eight additional checks](cleanup-browser-checks.json) cover Breakfast/Lunch at 320, 375, 430 and 1440px: no horizontal overflow, no source strips or routine timestamps, no prototype/year labels, and all four meal links visible. Typecheck, production build and the built-handler integration test were rerun successfully after the cleanup.

Viewed the mobile Breakfast, Lunch, Snacks and Dinner captures, the full mobile Lunch page, and desktop comparison. Verified native meal navigation from a scrolled position returns to the top, and that the mobile selector remains sticky. The latest 375px Lunch has 28px dish rows and a 1333px full document. Desktop Lunch has three 352px columns inside the 1200px app. Source dish text and genuine source groups/tags remain intact. Human dates omit years; machine-readable ISO dates retain them. The screenshots below show the latest layout after source-strip removal.

- [375px first viewport](screenshots/lunch-375.png)
- [375px full page](screenshots/lunch-375-full.png)
- [1440px desktop](screenshots/lunch-1440.png)

Screenshots use live source schedules fetched on the verification date, not the archived research fixtures. Browser rendering of the admin editor was additionally checked at 320/375px using a temporary signed test session outside application code; it correctly disabled saves without a private Blob store. That temporary browser harness is not part of the application. Native date-entry controls retain their full calendar year for accurate editing.

The source-strip-removal stylesheet was about 16.5 kB uncompressed, with two self-hosted fonts totaling about 81 kB. Tailwind scans only production source, excluding the historical prototypes. No hardware Android test, production load test, or live deployment was performed. No deployment was created.

## All-meal loading, device cache and stronger date typography

The owner subsequently requested loading all four meals together, caching on the device, and stronger desktop date text. All four meals now arrive in the initial server response. A single small script switches panels instantly; the accessible tabs support arrow keys, Home/End, ordinary links and browser history. IDs remain unique across panels. The calendar date is 23px/30px at desktop, weight 500, with a 16px weekday and a separate 13px Tomorrow cue; tablet uses 18px/14px.

Rechecked all four meals at 320, 375, 430, 768 and 1440px: 20 states, no horizontal overflow, four preloaded panels, exactly one visible panel, 44px meal targets, and zero requests or document navigations while switching. [Raw results](bundle-browser-checks.json) include the online and offline checks. Actual keyboard input switched Breakfast to Lunch and browser Back restored Breakfast within the same document.

For the offline browser check, first loaded the actual production build with live menus on a temporary local server, then stopped that server entirely. Reload still opened the dated cached page, stylesheet and fonts, with a saved-menu notice. All four meals switched with zero requests at 375px. Requests to `/admin` and an admin POST failed through to the absent server; neither was served from cache. Cache inspection showed only the dated public document and three static assets. The test server was restarted for the remaining checks.

Device-cache unit tests execute the actual service-worker script with mocked browser storage/network and verify private-route exclusion, static-resource restrictions, date-keyed storage, no repeated menu fetch on initial save, exact dinner rollover, honest missing-tomorrow behavior, three-page retention and 48-hour expiry. The built-handler integration test additionally verifies four panels in the initial HTML and the existing admin/security flow. Typecheck, all 15 unit cases, production build, the integration test, worker syntax and whitespace checks passed. Dependency audit reported zero vulnerabilities.

Measured production response: approximately 15.2 kB HTML (3.8 kB gzip), including a 3.4 kB inline switching script (1.55 kB gzip). The stylesheet is about 17.1 kB; the service worker is about 9.3 kB before compression and loads in the background. These are payload measurements, not a hardware Android performance benchmark.

- [Stronger desktop date and Tomorrow cue](screenshots/date-desktop-1440.png)
- [Saved-menu fallback with the server stopped](screenshots/device-cache-offline-1440.png)
