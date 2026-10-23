// Exercises the actual built Vercel handler. Only external HTTP services are mocked.
import assert from "node:assert/strict";
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { MockAgent, setGlobalDispatcher } from "undici";

test(
  "built application: login, shared throttling, CSRF, save, public read, restore and logout",
  { timeout: 30_000 },
  async (context) => {
    context.mock.timers.enable({
      apis: ["Date"],
      now: new Date("2026-10-22T12:00:00Z"),
    });
    const password = randomBytes(24).toString("base64url"),
      salt = randomBytes(16);
    const hash = `scrypt$131072$8$1$${salt.toString("hex")}$${scryptSync(password, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 160 * 1024 * 1024 }).toString("hex")}`;
    const previousEnv = { ...process.env };
    Object.assign(process.env, {
      NODE_ENV: "production",
      VERCEL: "1",
      ADMIN_PASSWORD_HASH: hash,
      ADMIN_SESSION_SECRET: randomBytes(32).toString("hex"),
      ADMIN_ORIGIN: "https://menus.example",
      ADMIN_LOGIN_RATE_LIMIT_ID: "admin-login",
      BLOB_READ_WRITE_TOKEN: `vercel_blob_rw_teststore_${randomBytes(24).toString("hex")}`,
    });
    const mock = new MockAgent();
    mock.disableNetConnect();
    setGlobalDispatcher(mock);
    const store = new Map<string, string>();
    const bodyText = async (body: unknown) => {
      if (typeof body === "string") return body;
      const chunks: Buffer[] = [];
      for await (const chunk of body as AsyncIterable<Uint8Array>)
        chunks.push(Buffer.from(chunk));
      return Buffer.concat(chunks).toString("utf8");
    };
    let attempts = 0,
      limiterState = "normal",
      fc2Unavailable = false;
    const menus = mock.get("https://menus.example");
    menus
      .intercept({
        path: /\/\.well-known\/vercel\/rate-limit-api\/admin-login/,
        method: "GET",
      })
      .reply(() => {
        if (limiterState === "missing") return { statusCode: 404, data: "" };
        return { statusCode: ++attempts > 5 ? 429 : 204, data: "" };
      })
      .persist();
    const blobOrigin = "https://teststore.private.blob.vercel-storage.com";
    mock
      .get(blobOrigin)
      .intercept({ path: /.*/, method: "GET" })
      .reply((options) => {
        const key = new URL(options.path, blobOrigin).pathname.slice(1),
          value = store.get(key);
        return {
          statusCode: value === undefined ? 404 : 200,
          data: value ?? "",
          responseOptions: { headers: { "content-type": "application/json" } },
        };
      })
      .persist();
    mock
      .get("https://vercel.com")
      .intercept({ path: /\/api\/blob\/\?pathname=/, method: "PUT" })
      .reply(async (options) => {
        const pathname = new URL(
          options.path,
          "https://vercel.com",
        ).searchParams.get("pathname")!;
        store.set(pathname, await bodyText(options.body));
        return {
          statusCode: 200,
          data: JSON.stringify({
            url: `${blobOrigin}/${pathname}`,
            downloadUrl: `${blobOrigin}/${pathname}?download=1`,
            pathname,
            contentType: "application/json",
            contentDisposition: "",
            etag: "test-etag",
          }),
        };
      })
      .persist();
    mock
      .get("https://vercel.com")
      .intercept({ path: "/api/blob/delete", method: "POST" })
      .reply(async (options) => {
        const body = JSON.parse(await bodyText(options.body)) as {
          urls: string[];
        };
        for (const path of body.urls) store.delete(path);
        return { statusCode: 200, data: "{}" };
      })
      .persist();
    const bundle = `const week=${readFileSync("tests/fixtures/fc1-menu-literal.txt", "utf8")};const sources=[{key:'Food Court-1',data:week}];`;
    const fc1 = mock.get("https://bluspring.vercel.app");
    fc1
      .intercept({ path: "/", method: "GET" })
      .reply(200, '<script type="module" src="/assets/menu.js"></script>')
      .persist();
    fc1
      .intercept({ path: "/assets/menu.js", method: "GET" })
      .reply(200, bundle, {
        headers: { "last-modified": "Wed, 21 Oct 2026 07:23:29 GMT" },
      })
      .persist();
    mock
      .get("https://tikm.coolstuff.work")
      .intercept({
        path: /\/api\/menu\?date=2026-10-(22|23)&v=2/,
        method: "GET",
      })
      .reply((options) => {
        if (options.path.includes("2026-10-23") || fc2Unavailable)
          return { statusCode: 404, data: "{}" };
        return {
          statusCode: 200,
          data: readFileSync(
            "tests/fixtures/fc2-menu-2026-10-22.json",
            "utf8",
          ),
        };
      })
      .persist();
    mock
      .get("https://sindhi.coolstuff.work")
      .intercept({ path: "/api/menu", method: "GET" })
      .reply(
        200,
        readFileSync("tests/fixtures/sindhi-week-2026-10-19.json", "utf8"),
      )
      .persist();
    try {
      const { default: app } = (await import(
        pathToFileURL(`${process.cwd()}/.vercel/output/_functions/entry.mjs`)
          .href
      )) as { default: { fetch: (request: Request) => Promise<Response> } };
      const request = (path: string, options: RequestInit = {}) =>
        app.fetch(new Request(`https://menus.example${path}`, options));
      const post = (
        path: string,
        data: Record<string, string>,
        cookie = "",
        origin = "https://menus.example",
      ) =>
        request(path, {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            origin,
            cookie,
            "x-real-ip": "192.0.2.10",
          },
          body: new URLSearchParams(data),
        });
      const hidden = (html: string, name: string) =>
        new RegExp(`name="${name}" value="([^"]+)"`).exec(html)?.[1] ?? "";
      const cookie = (response: Response, name: string) =>
        response.headers
          .getSetCookie()
          .find((c) => c.startsWith(`${name}=`))
          ?.split(";")[0] ?? "";
      const unauthenticated = await request("/admin");
      assert.equal(unauthenticated.status, 303);
      assert.equal(unauthenticated.headers.get("location"), "/admin/login");
      assert.equal((await post("/admin", {})).status, 401);
      assert.equal((await post("/admin/restore", {})).status, 401);
      assert.equal((await post("/admin/logout", {})).status, 401);
      const login = await request("/admin/login");
      assert.equal(login.status, 200);
      assert.equal(login.headers.get("referrer-policy"), "same-origin");
      assert.match(login.headers.get("cache-control")!, /no-store/);
      assert.match(
        login.headers.get("content-security-policy")!,
        /frame-ancestors 'none'/,
      );
      const loginCookie = cookie(login, "__Host-mess_login");
      const csrf = hidden(await login.text(), "csrf");
      assert.ok(csrf && loginCookie);
      const loginData = { password, csrf };
      assert.equal(
        (
          await post(
            "/admin/login",
            loginData,
            loginCookie,
            "https://evil.example",
          )
        ).status,
        403,
      );
      assert.equal(
        (
          await post(
            "/admin/login",
            { ...loginData, csrf: "wrong" },
            loginCookie,
          )
        ).status,
        403,
      );
      limiterState = "missing";
      assert.equal(
        (await post("/admin/login", loginData, loginCookie)).status,
        503,
      );
      limiterState = "normal";
      for (let i = 0; i < 5; i++)
        assert.equal(
          (
            await post(
              "/admin/login",
              { ...loginData, password: "incorrect" },
              loginCookie,
            )
          ).status,
          401,
        );
      const throttled = await post("/admin/login", loginData, loginCookie);
      assert.equal(throttled.status, 429);
      assert.equal(throttled.headers.get("retry-after"), "600");
      attempts = 0; // External service's test window reset, not application state.
      const signedIn = await post("/admin/login", loginData, loginCookie);
      assert.equal(signedIn.status, 303);
      const sessionCookie = cookie(signedIn, "__Host-mess_admin");
      const setCookie = signedIn.headers
        .getSetCookie()
        .find((c) => c.startsWith("__Host-mess_admin="))!;
      assert.match(setCookie, /HttpOnly/i);
      assert.match(setCookie, /Secure/i);
      assert.match(setCookie, /SameSite=Strict/i);
      assert.match(setCookie, /Path=\//i);
      assert.doesNotMatch(setCookie, /Domain=/i);
      const editor = await request(
        "/admin?date=2026-10-22&meal=lunch&mess=fc1",
        { headers: { cookie: sessionCookie } },
      );
      assert.equal(editor.status, 200);
      const editorHtml = await editor.text(),
        sessionCsrf = hidden(editorHtml, "csrf");
      assert.ok(sessionCsrf);
      assert.match(editorHtml, /LAUKI CHANNA KOOTU/);
      const data = {
        csrf: sessionCsrf,
        date: "2026-10-22",
        mess: "fc1",
        meal: "lunch",
        start: "12:00",
        end: "14:00",
        items: "Verified test dish",
        sections: "",
        tags: "",
        note: "<script>alert(1)</script>",
      };
      assert.equal(
        (await post("/admin", data, sessionCookie, "https://evil.example"))
          .status,
        403,
      );
      assert.equal(
        (await post("/admin", { ...data, csrf: "wrong" }, sessionCookie))
          .status,
        403,
      );
      assert.equal(
        (
          await post(
            "/admin",
            { ...data, items: "x".repeat(161) },
            sessionCookie,
          )
        ).status,
        400,
      );
      assert.equal((await post("/admin", data, sessionCookie)).status, 303);
      assert.ok(store.has("overrides/2026-10-22/fc1/lunch.json"));
      const publicResponse = await request("/?meal=lunch&date=2026-10-22");
      assert.equal(publicResponse.status, 200);
      assert.equal(publicResponse.headers.get("referrer-policy"), "no-referrer");
      const publicHtml = await publicResponse.text();
      assert.match(publicHtml, /Verified test dish/i);
      assert.match(publicHtml, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
      assert.equal((publicHtml.match(/data-meal-panel=/g) ?? []).length, 4);
      for (const meal of ["breakfast", "lunch", "snacks", "dinner"])
        assert.match(publicHtml, new RegExp(`id="panel-${meal}"`));
      assert.equal(
        (publicHtml.match(/<script type="module"/g) ?? []).length,
        1,
      );
      assert.doesNotMatch(
        publicHtml,
        /vercel_blob_rw_|scrypt\$|Demo site|Snapshot|Earlier design/,
      );
      assert.equal(
        (
          await post(
            "/admin/restore",
            {
              csrf: sessionCsrf,
              date: data.date,
              mess: data.mess,
              meal: data.meal,
            },
            sessionCookie,
          )
        ).status,
        303,
      );
      assert.equal(store.has("overrides/2026-10-22/fc1/lunch.json"), false);
      const restoredHtml = await (
        await request("/?meal=lunch&date=2026-10-22")
      ).text();
      assert.match(restoredHtml, /Lauki channa kootu/);
      assert.doesNotMatch(restoredHtml, /Verified test dish/i);
      context.mock.timers.setTime(new Date("2026-10-22T12:02:00Z").getTime());
      fc2Unavailable = true;
      const cachedHtml = await (
        await request("/?meal=lunch&date=2026-10-22")
      ).text();
      assert.match(cachedHtml, /Cached menu/);
      assert.match(cachedHtml, /Jeera roti/);
      assert.match(cachedHtml, /Lauki channa kootu/);
      assert.match(cachedHtml, /2026-10-22T12:00:00.000Z/); // Original retrieval timestamp retained.
      fc2Unavailable = false;
      const out = await post(
        "/admin/logout",
        { csrf: sessionCsrf },
        sessionCookie,
      );
      assert.equal(out.status, 303);
      assert.match(
        out.headers
          .getSetCookie()
          .find((c) => c.startsWith("__Host-mess_admin="))!,
        /Max-Age=0/i,
      );
      assert.equal((await request("/admin")).status, 303);
      context.mock.timers.setTime(new Date("2026-10-22T16:00:00Z").getTime()); // 21:30 IST
      const tomorrow = await (await request("/")).text();
      assert.match(tomorrow, /<time datetime="2026-10-23">/);
      assert.match(tomorrow, />Breakfast<\/h1>/);
      assert.match(tomorrow, /Raggi set dosa/); // Actual Friday FC1 data, not Thursday's breakfast.
      assert.match(tomorrow, /No dated menu is available for 23 Oct/); // Missing FC2 tomorrow stays missing.
      assert.doesNotMatch(tomorrow, /Onion utthappam/i);
    } finally {
      for (const key of Object.keys(process.env))
        if (!(key in previousEnv)) delete process.env[key];
      Object.assign(process.env, previousEnv);
      context.mock.timers.reset();
      await mock.close();
    }
  },
);
