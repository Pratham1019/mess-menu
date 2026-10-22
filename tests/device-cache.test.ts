import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

class MemoryCache {
  entries = new Map<string, Response>();
  key(request: Request | string) {
    return typeof request === "string" ? request : request.url;
  }
  async match(request: Request | string) {
    return this.entries.get(this.key(request))?.clone();
  }
  async put(request: Request | string, response: Response) {
    this.entries.set(this.key(request), response.clone());
  }
  async delete(request: Request | string) {
    return this.entries.delete(this.key(request));
  }
  async keys() {
    return [...this.entries.keys()].map((url) => new Request(url));
  }
}
function harness(now = "2026-10-22T12:00:00Z") {
  const handlers = new Map<string, (event: any) => void>();
  const stores = new Map<string, MemoryCache>();
  const storage = {
    async keys() {
      return [...stores.keys()];
    },
    async delete(name: string) {
      return stores.delete(name);
    },
    async open(name: string) {
      if (!stores.has(name)) stores.set(name, new MemoryCache());
      return stores.get(name)!;
    },
  };
  let time = Date.parse(now),
    online = false;
  const requests: string[] = [];
  const FixedDate = class extends Date {
    constructor(value?: string | number) {
      super(value ?? time);
    }
    static now() {
      return time;
    }
  };
  const context = vm.createContext({
    URL,
    Request,
    Response,
    Promise,
    Intl,
    Set,
    Number,
    Array,
    String,
    Date: FixedDate,
    setTimeout,
    clearTimeout,
    caches: storage,
    fetch: async (request: Request | string) => {
      requests.push(typeof request === "string" ? request : request.url);
      if (!online) throw new Error("Offline");
      return new Response("public static asset", { status: 200 });
    },
    self: {
      location: new URL("https://menus.example/"),
      clients: { claim: async () => {} },
      skipWaiting: async () => {},
      addEventListener: (name: string, handler: (event: any) => void) =>
        handlers.set(name, handler),
    },
  });
  vm.runInContext(readFileSync("public/sw.js", "utf8"), context);
  async function save(
    date: string,
    source = "https://menus.example/",
    resources: string[] = [],
  ) {
    const html = `<!doctype html><html lang="en"><body><div data-menu-date="${date}" data-meal-ends="570,855,1080,1290">${["breakfast", "lunch", "snacks", "dinner"].map((meal) => `<section id="panel-${meal}">${meal} dishes for ${date}</section>`).join("")}</div></body></html>`;
    const pending: Promise<unknown>[] = [];
    handlers.get("message")!({
      source: { url: source },
      data: { type: "SAVE_DAY", html, resources },
      waitUntil: (promise: Promise<unknown>) => pending.push(promise),
    });
    await Promise.all(pending);
  }
  async function navigate(path: string, method = "GET", mode = "navigate") {
    const pending: Promise<unknown>[] = [];
    const request = new Request(new URL(path, "https://menus.example"), {
      method,
    });
    Object.defineProperty(request, "mode", { value: mode });
    let response: Promise<Response> | undefined;
    handlers.get("fetch")!({
      request,
      waitUntil: (promise: Promise<unknown>) => pending.push(promise),
      respondWith: (promise: Promise<Response>) => {
        response = promise;
      },
    });
    const result = response ? await response : undefined;
    await Promise.all(pending);
    return result;
  }
  return {
    save,
    navigate,
    storage,
    requests,
    setTime: (value: string) => {
      time = Date.parse(value);
    },
    setOnline: (value: boolean) => {
      online = value;
    },
  };
}
test("device cache saves all four meals from the page without requesting menus again", async () => {
  const h = harness();
  await h.save("2026-10-22");
  assert.deepEqual(h.requests, []);
  const cached = await h.navigate("/?meal=dinner&date=2026-10-22");
  const html = await cached!.text();
  assert.match(html, /data-device-cache="true"/);
  for (const meal of ["breakfast", "lunch", "snacks", "dinner"])
    assert.match(html, new RegExp(`${meal} dishes for 2026-10-22`));
});
test("private pages, mutations, external URLs and admin-origin cache messages bypass the cache", async () => {
  const h = harness();
  await h.save("2026-10-22", "https://menus.example/admin");
  assert.equal((await h.storage.keys()).length, 0);
  for (const [path, method] of [
    ["/admin", "GET"],
    ["/admin/login", "GET"],
    ["/admin/restore", "POST"],
    ["/", "POST"],
    ["https://other.example/", "GET"],
  ])
    assert.equal(await h.navigate(path!, method), undefined);
  for (const path of ["/fonts/%2f..%2fadmin", "/_astro/%2f..%2fadmin"])
    assert.equal(await h.navigate(path, "GET", "script"), undefined);
  h.setOnline(true);
  await h.save("2026-10-22", "https://menus.example/", [
    "https://menus.example/admin",
    "https://menus.example/admin/login",
    "https://external.example/x.js",
    "https://menus.example/_astro/menus.js",
  ]);
  assert.deepEqual(h.requests, ["https://menus.example/_astro/menus.js"]);
});
test("offline dinner rollover uses tomorrow’s actual cache and never relabels today’s dishes", async () => {
  const h = harness();
  await h.save("2026-10-22");
  await h.save("2026-10-23");
  h.setTime("2026-10-22T16:00:00Z"); // Exactly 21:30 IST.
  const html = await (await h.navigate("/"))!.text();
  assert.match(html, /data-menu-date="2026-10-23"/);
  assert.match(html, /breakfast dishes for 2026-10-23/);
  assert.doesNotMatch(html, /dishes for 2026-10-22/);
  const explicit = await (await h.navigate(
    "/?date=2026-10-22&meal=dinner",
  ))!.text();
  assert.match(explicit, /data-menu-date="2026-10-22"/);
});
test("missing next-day offline data shows an honest empty state and a link to the saved date", async () => {
  const h = harness();
  await h.save("2026-10-22");
  h.setTime("2026-10-22T16:00:00Z");
  const html = await (await h.navigate("/"))!.text();
  assert.match(html, /<time datetime="2026-10-23">/);
  assert.match(html, /No saved menus/);
  assert.match(html, /View saved menus from 22 Oct/);
  assert.doesNotMatch(html, /dishes for 2026-10-22/);
});
test("device cache expires after 48 hours and retains at most three dated pages", async () => {
  const h = harness();
  for (const date of ["2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23"])
    await h.save(date);
  assert.equal(
    (await (await h.storage.open("mess-public-days-v1")).keys()).length,
    3,
  );
  h.setTime("2026-10-24T12:00:01Z");
  const html = await (await h.navigate("/?date=2026-10-23&meal=lunch"))!.text();
  assert.match(html, /No saved menus/);
  assert.doesNotMatch(html, /lunch dishes/);
});
