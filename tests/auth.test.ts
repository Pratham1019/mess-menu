import assert from "node:assert/strict";
import { randomBytes, scryptSync } from "node:crypto";
import { test } from "node:test";
import {
  newSession,
  readToken,
  signToken,
  verifyPassword,
  SESSION_SECONDS,
  type AdminConfig,
} from "../src/lib/server/auth";
import {
  checkOrigin,
  checkCsrf,
  readForm,
  boundedText,
  HttpError,
} from "../src/lib/server/http";
import { limitLogin } from "../src/lib/server/rate-limit";

const password = randomBytes(24).toString("base64url");
const salt = randomBytes(16);
const hash = `scrypt$131072$8$1$${salt.toString("hex")}$${scryptSync(password, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 160 * 1024 * 1024 }).toString("hex")}`;
const config: AdminConfig = {
  hash,
  secret: randomBytes(32).toString("hex"),
  origin: "https://menus.example",
  rateLimitId: "admin-login",
};

test("scrypt verifies only the right password; rejects malformed hashes and excessive bytes", async () => {
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword(`${password}x`, hash), false);
  assert.equal(await verifyPassword("", hash), false);
  assert.equal(await verifyPassword("a".repeat(1025), hash), false);
  assert.equal(
    await verifyPassword(password, hash.replace("131072", "1024")),
    false,
  );
});
test("sessions reject forgery, purpose confusion, expiry, future issue time and key/origin/password rotation", () => {
  const now = Date.parse("2026-10-22T15:00:00Z"),
    session = newSession(SESSION_SECONDS, now);
  const token = signToken(session, "session", config);
  assert.deepEqual(readToken(token, "session", config, now), session);
  assert.equal(
    readToken(
      token.replace(/.$/, token.endsWith("A") ? "B" : "A"),
      "session",
      config,
      now,
    ),
    null,
  );
  assert.equal(readToken(token, "login", config, now), null);
  assert.equal(
    readToken(token, "session", config, now + SESSION_SECONDS * 1000),
    null,
  );
  assert.equal(readToken(token, "session", config, now - 1000), null);
  assert.equal(
    readToken(
      token,
      "session",
      { ...config, secret: randomBytes(32).toString("hex") },
      now,
    ),
    null,
  );
  assert.equal(
    readToken(token, "session", { ...config, hash: `${hash}x` }, now),
    null,
  );
  assert.equal(
    readToken(
      token,
      "session",
      { ...config, origin: "https://other.example" },
      now,
    ),
    null,
  );
  assert.equal(
    readToken(
      signToken(newSession(SESSION_SECONDS + 1, now), "session", config),
      "session",
      config,
      now,
    ),
    null,
  );
  assert.equal(readToken("garbage", "session", config, now), null);
});
test("exact origin, fetch metadata and CSRF token are required", () => {
  const good = new Request(config.origin, {
    headers: { origin: config.origin, "sec-fetch-site": "same-origin" },
  });
  assert.doesNotThrow(() => checkOrigin(good, config.origin));
  for (const origin of [
    undefined,
    "null",
    "https://menus.example.evil.test",
    "https://evil.test",
  ])
    assert.throws(
      () =>
        checkOrigin(
          new Request(config.origin, { headers: origin ? { origin } : {} }),
          config.origin,
        ),
      HttpError,
    );
  assert.throws(
    () =>
      checkOrigin(
        new Request(config.origin, {
          headers: { origin: config.origin, "sec-fetch-site": "cross-site" },
        }),
        config.origin,
      ),
    HttpError,
  );
  const session = newSession();
  assert.doesNotThrow(() =>
    checkCsrf(new URLSearchParams({ csrf: session.csrf }), session),
  );
  assert.throws(
    () => checkCsrf(new URLSearchParams({ csrf: "wrong" }), session),
    HttpError,
  );
});
test("forms reject duplicate/unknown fields, invalid encodings, content types, oversized streams and invalid UTF-8", async () => {
  const request = (body: string, type = "application/x-www-form-urlencoded") =>
    new Request(config.origin, {
      method: "POST",
      headers: { "content-type": type },
      body,
    });
  assert.equal(
    (await readForm(request("csrf=abc"), ["csrf"])).get("csrf"),
    "abc",
  );
  for (const body of ["csrf=a&csrf=b", "extra=b", "csrf=%ZZ", "csrf=%FF"])
    await assert.rejects(readForm(request(body), ["csrf"]), HttpError);
  await assert.rejects(
    readForm(request("{}", "application/json"), ["csrf"]),
    HttpError,
  );
  await assert.rejects(
    readForm(request("csrf=" + "x".repeat(5000)), ["csrf"], 4096),
    HttpError,
  );
  await assert.rejects(
    boundedText(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(70_000));
          controller.close();
        },
      }),
      65_536,
    ),
    HttpError,
  );
  await assert.rejects(
    boundedText(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array([255]));
          controller.close();
        },
      }),
      65_536,
    ),
    HttpError,
  );
});
test("login fails closed outside deployment; no local memory bypass exists", async () => {
  const previous = process.env.VERCEL;
  delete process.env.VERCEL;
  try {
    await assert.rejects(
      limitLogin(new Request(config.origin)),
      (error: unknown) => error instanceof HttpError && error.status === 503,
    );
  } finally {
    if (previous !== undefined) process.env.VERCEL = previous;
  }
});
