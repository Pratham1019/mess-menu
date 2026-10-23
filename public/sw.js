/* Public menu cache only. No admin documents, credentials, or mutation requests. */
const DAY_CACHE = "mess-public-days-v1";
const ASSET_CACHE = "mess-public-assets-v2";
const MAX_AGE = 48 * 60 * 60 * 1000;
const MEALS = ["breakfast", "lunch", "snacks", "dinner"];
const isoDate = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value + "T12:00:00Z")) &&
  new Date(value + "T12:00:00Z").toISOString().slice(0, 10) === value;
const dayKey = (date) =>
  new URL("/__saved_menus__/" + date, self.location.origin).href;
const label = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
const sameOrigin = (url) => url.origin === self.location.origin;
function publicPage(url) {
  return (
    sameOrigin(url) &&
    url.pathname === "/" &&
    [...url.searchParams.keys()].every((key) =>
      ["meal", "date"].includes(key),
    ) &&
    url.searchParams.getAll("meal").length <= 1 &&
    url.searchParams.getAll("date").length <= 1 &&
    (!url.searchParams.has("meal") ||
      MEALS.includes(url.searchParams.get("meal"))) &&
    (!url.searchParams.has("date") || isoDate(url.searchParams.get("date")))
  );
}
function publicAsset(url) {
  if (!sameOrigin(url)) return false;
  if (
    /^\/_astro\/[\w.-]+\.(?:css|js)$/.test(url.pathname) ||
    [
      "/fonts/ibm-plex-sans-latin.woff2",
      "/fonts/fraunces.woff2",
    ].includes(url.pathname)
  )
    return true;
  // Public client resources on Astro's local dev server; no server modules.
  return (
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
    ([
      "/src/scripts/menus.ts",
      "/src/styles/base.css",
      "/src/styles/site.css",
    ].includes(url.pathname) ||
      (url.pathname === "/src/pages/index.astro" &&
        url.searchParams.has("astro") &&
        url.searchParams.get("type") === "script"))
  );
}
self.addEventListener("install", (event) =>
  event.waitUntil(self.skipWaiting()),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (
          key.startsWith("mess-public-") &&
          ![DAY_CACHE, ASSET_CACHE].includes(key)
        )
          await caches.delete(key);
      await self.clients.claim();
    })(),
  ),
);

async function pruneDays(cache) {
  const entries = await Promise.all(
    (await cache.keys()).map(async (request) => {
      const response = await cache.match(request);
      return {
        request,
        time: Number(response?.headers.get("x-mess-saved-at")),
      };
    }),
  );
  entries.sort((a, b) => b.time - a.time);
  await Promise.all(
    entries
      .filter(
        (entry, index) =>
          index >= 3 || !entry.time || Date.now() - entry.time > MAX_AGE,
      )
      .map((entry) => cache.delete(entry.request)),
  );
}
async function saveDay(html) {
  if (
    typeof html !== "string" ||
    html.length > 250_000 ||
    html.includes('data-device-cache="true"')
  )
    return;
  const date = /\bdata-menu-date="([\d-]+)"/.exec(html)?.[1];
  if (
    !isoDate(date) ||
    !MEALS.every((meal) => html.includes(`id="panel-${meal}"`))
  )
    return;
  const cache = await caches.open(DAY_CACHE);
  await cache.put(
    dayKey(date),
    new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-mess-saved-at": String(Date.now()),
        "x-content-type-options": "nosniff",
      },
    }),
  );
  await pruneDays(cache);
}
async function saveAssets(resources) {
  const cache = await caches.open(ASSET_CACHE);
  const urls = [...new Set(resources)]
    .filter((value) => {
      try {
        return typeof value === "string" && publicAsset(new URL(value));
      } catch {
        return false;
      }
    })
    .slice(0, 32);
  await Promise.allSettled(
    urls.map(async (url) => {
      const response = await fetch(url, {
        cache: "force-cache",
        credentials: "omit",
      });
      if (response.ok) await cache.put(url, response);
    }),
  );
  const keys = await cache.keys();
  await Promise.all(
    keys
      .slice(0, Math.max(0, keys.length - 48))
      .map((key) => cache.delete(key)),
  );
}
self.addEventListener("message", (event) => {
  if (event.data?.type !== "SAVE_DAY" || !event.source?.url) return;
  try {
    if (!publicPage(new URL(event.source.url))) return;
  } catch {
    return;
  }
  event.waitUntil(
    Promise.allSettled([
      saveDay(event.data.html),
      saveAssets(
        Array.isArray(event.data.resources) ? event.data.resources : [],
      ),
    ]),
  );
});

async function cachedDay(date) {
  const cache = await caches.open(DAY_CACHE);
  const response = await cache.match(dayKey(date));
  if (!response) return null;
  const time = Number(response.headers.get("x-mess-saved-at"));
  if (!time || time > Date.now() || Date.now() - time > MAX_AGE) {
    await cache.delete(dayKey(date));
    return null;
  }
  return response;
}
function emptyPage(date, previous) {
  // Only validated ISO dates and their Intl-formatted labels enter this HTML.
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Saved menus · The mess</title><style>
    body{margin:0;background:#f7f3e9;color:#2c2528;font:16px/1.5 system-ui,sans-serif}main{max-width:600px;margin:40px auto;padding:0 24px}h1{font:600 32px Georgia,serif}a{color:#7c293e;text-underline-offset:4px;display:inline-block;padding:12px 0}nav{display:flex;flex-wrap:wrap;gap:20px}time{font-weight:600}
    </style></head><body><main><h1>The mess.</h1><time datetime="${date}">${label(date)}</time><p>No saved menus are available for this date. Reconnect and reload to fetch them.</p><nav aria-label="Meal period">${MEALS.map((meal) => `<a href="/?date=${date}&meal=${meal}">${meal[0].toUpperCase() + meal.slice(1)}</a>`).join("")}</nav><a href="/">Try again</a>${previous ? `<p><a href="/?date=${previous}&meal=breakfast">View saved menus from ${label(previous)}</a></p>` : ""}</main></body></html>`,
    {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    },
  );
}
async function offlinePage(url) {
  const local = new Date(Date.now() + 330 * 60_000);
  const today = local.toISOString().slice(0, 10);
  let date = url.searchParams.get("date") || today;
  if (!url.searchParams.has("date") && !url.searchParams.has("meal")) {
    const todayResponse = await cachedDay(today);
    const html = todayResponse ? await todayResponse.text() : "";
    const ends = /\bdata-meal-ends="([\d,]+)"/
      .exec(html)?.[1]
      ?.split(",")
      .map(Number);
    const dinnerEnd = ends?.length === 4 ? ends[3] : 1290;
    if (local.getUTCHours() * 60 + local.getUTCMinutes() >= dinnerEnd)
      date = new Date(local.getTime() + 86_400_000).toISOString().slice(0, 10);
  }
  const response = await cachedDay(date);
  if (response) {
    const html = (await response.text()).replace(
      /<html\b/,
      '<html data-device-cache="true"',
    );
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  }
  const cache = await caches.open(DAY_CACHE);
  await pruneDays(cache);
  const latest = (await cache.keys()).at(-1);
  const previous = latest
    ? new URL(latest.url).pathname.split("/").at(-1)
    : null;
  return emptyPage(date, isoDate(previous) ? previous : null);
}
async function navigation(event, url) {
  let timer;
  const network = fetch(event.request).then((response) => {
    if (!response.ok) throw new Error("Live menus unavailable");
    event.waitUntil(
      response
        .clone()
        .text()
        .then(saveDay)
        .catch(() => {}),
    );
    return response;
  });
  try {
    return await Promise.race([
      network,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Network timeout")), 8000);
      }),
    ]);
  } catch {
    return offlinePage(url);
  } finally {
    clearTimeout(timer);
  }
}
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (event.request.mode === "navigate" && publicPage(url))
    event.respondWith(navigation(event, url));
  else if (publicAsset(url))
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSET_CACHE);
        // Development modules should always reflect current source while online.
        const cached = await cache.match(event.request);
        if (cached && !url.pathname.startsWith("/src/")) return cached;
        try {
          const response = await fetch(event.request);
          if (response.ok)
            event.waitUntil(
              cache.put(event.request, response.clone()).catch(() => {}),
            );
          return response;
        } catch (error) {
          if (cached) return cached;
          throw error;
        }
      })(),
    );
});
