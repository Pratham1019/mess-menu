# Single-admin security design

Recorded before implementation, 22 October. The public menu reader needs no account. The owner explicitly requested one private editor, superseding the earlier authentication non-goal only for `/admin`.

## Required deployment configuration

Set these in Vercel Project Settings → Environment Variables, separately for Production and Preview, and redeploy after changes. Never prefix secrets with `PUBLIC_`. Do not commit actual values.

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD_HASH` | Salted scrypt hash produced by `npm run admin:hash`. Parameters: N=131072, r=8, p=1, 64-byte output, 16-byte random salt. No plaintext password environment variable. |
| `ADMIN_SESSION_SECRET` | Independent random signing key, at least 32 random bytes encoded as 64 hexadecimal characters. Generate locally with `openssl rand -hex 32`. |
| `ADMIN_ORIGIN` | Exact trusted origin, e.g. `https://your-domain.example`, without a path. Required for every environment where login is enabled. Use an explicit preview origin for previews. Local HTTPS is supported and recommended for admin development. |
| `ADMIN_LOGIN_RATE_LIMIT_ID` | ID of a published Vercel Firewall SDK rate-limit rule. Configure a maximum of 5 attempts per 10 minutes per IP. |
| `BLOB_READ_WRITE_TOKEN` | Server-only credential for a **private** Vercel Blob store. Stores dated administrator overrides and last successful source snapshots. |

Vercel provides `VERCEL=1` and its trusted IP headers automatically. Login is disabled outside Vercel when the shared limiter is unavailable. There is no in-memory limiter or production bypass. A missing/malformed configuration or unavailable limiter fails closed. Local security tests inject mocks at the test boundary, never through an application environment switch.

## Authentication and authorization

- Node's built-in asynchronous scrypt verifies the submitted password on the server with a constant-time digest comparison. Input is limited to 1024 UTF-8 bytes before hashing. No auth framework, database, registration, usernames or OAuth.
- The session is a versioned, base64url payload containing issued/expiry times and a random CSRF token, authenticated with HMAC-SHA256. Its signing key is derived from both the session secret and current password hash, so rotating either invalidates every existing session.
- Session lifetime is eight hours, with no silent renewal. `__Host-mess_admin` is `HttpOnly; Secure; SameSite=Strict; Path=/`, has no Domain, and expires with the signed payload. Production admin access requires HTTPS.
- Middleware verifies the signature and expiry on every `/admin` route. Only `/admin/login` is public. Every write is POST-only and independently checks the authenticated session at its handler boundary.
- Logout requires POST, exact-origin and CSRF validation, then expires the cookie. Stateless logout clears this browser's session; a stolen cookie remains usable until expiry or global key/password rotation. Individual remote revocation requires server state and is deliberately outside this design.
- Admin responses use private `no-store`, `X-Robots-Tag: noindex, nofollow`, frame denial, restrictive CSP, `Referrer-Policy: same-origin`, and MIME sniffing protection. The referrer policy preserves the Origin header on native same-origin form submissions while withholding referrers from external sites. `no-referrer` would turn those POST origins into `null` and prevent login, saves, restore and logout. Public responses retain `no-referrer`. No credentials or cookies are logged.

## Shared login rate limiting

Use `@vercel/firewall`'s `checkRateLimit` before password verification, with the deployment's trusted client IP. This uses deployment infrastructure, not function memory. Publish the configured SDK rule in the Vercel Firewall dashboard and expose Vercel system variables. Rule setup is an operational prerequisite, not something a build can silently provision. Missing-rule (`error: not-found`), missing-client-identity, blocked and service errors reject login; inspect the SDK's error as well as its `rateLimited` decision. The SDK deliberately allows development requests, so the application explicitly rejects that development path. Test the sixth attempt on a Preview deployment before production; an ID alone cannot establish that the dashboard rule has the correct threshold/action. The limiter is per IP, so campus NAT may temporarily affect multiple clients; it does not permanently lock the single admin account.

## CSRF and data boundaries

- All admin POSTs require an exact `Origin` match to `ADMIN_ORIGIN` and reject cross-site Fetch Metadata. Reject absent, null and malformed origins; never infer trust from Host or forwarded headers.
- Login includes a short-lived signed, random double-submit CSRF token bound to a separate `__Host-` HttpOnly, Secure, Strict cookie. Authenticated forms use the random token inside the signed session. Verify using constant-time comparison. CSRF checks also cover logout and deletion.
- Accept URL-encoded forms only; stream-limit request bodies (4 KiB login, 64 KiB edits) even without Content-Length. Reject unexpected/duplicate fields, invalid UTF-8, oversized values, malformed JSON, invalid calendar dates and invalid serving windows.
- Menu edits are confined to known messes/meals and dates within 31 days of IST today; Sindhi only Lunch/Dinner Monday–Saturday. At most 60 total dishes, 160 characters per dish, 8 source-provided sections, 60-character section titles, 8 tags per item, 32 characters per tag, and a 300-character note. Text is escaped by Astro, never rendered as HTML. Editor accepts plain dish lines and optional structured sections; no arbitrary URLs or upload paths.
- Store one override per date/mess/meal at a server-constructed Blob pathname. Metadata (save timestamp, source, version) is generated on the server. Deletion only removes that exact override and restores aggregation. Blob tokens never reach HTML or JavaScript. There is no browser upload/token endpoint.
- Source fetching uses fixed allowlisted HTTPS hosts, bounded bodies, deadlines, schema validation and independent error handling. Never execute downloaded source JavaScript. FC1 extraction parses literals as syntax only. Full dates and retrieval times remain in storage even though UI dates omit years. Cached schedules retain original dates and freshness; no research fixture is shipped as live data.

## Device cache boundary

The owner later requested device caching and instant meal switching. The public page now includes all four meals and a small client script. `/sw.js` handles only same-origin public `/` navigations and allowlisted public static resources. It never intercepts or stores admin HTML, login responses, mutation requests or external URLs. Cache-write messages are accepted only from public-reader clients, not `/admin`. Public menu HTML contains no password hash, session secret, Blob token or CSRF form. Normal admin responses retain their strict CSP and `no-store` headers, and the admin page does not register a service worker.

Device entries are keyed by full ISO date, capped at three pages and expire after 48 hours. Offline responses display a saved-menu notice and preserve actual dates. Admin logout does not need to clear this cache because it contains only the same menus visible to anonymous visitors. Newer public edits are fetched on the next successful online visit; no offline edit or authentication capability is provided.

## Deployment acceptance

Run `npm run check`, `npm test`, `npm run build`, and local mobile/desktop browser verification. Configure the private Blob store, secrets, exact origin and published firewall rule, then explicitly authorize deployment. On Preview verify correct/wrong password, attempt six (429), cookie attributes, logout, cross-origin rejection, direct mutation protection, successful save and restore, and source fetching. Platform rate limiting and actual Blob persistence require configured infrastructure; mocked tests cannot certify them.

References: [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [Vercel shared rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk), [Vercel Blob](https://vercel.com/docs/vercel-blob).
