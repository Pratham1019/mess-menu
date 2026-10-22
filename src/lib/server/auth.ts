import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import type { AstroCookies } from "astro";
import { env } from "./env";

export const SESSION_COOKIE = "__Host-mess_admin";
export const LOGIN_COOKIE = "__Host-mess_login";
export const SESSION_SECONDS = 8 * 60 * 60;
export const passwordPattern =
  /^scrypt\$131072\$8\$1\$[a-f0-9]{32}\$[a-f0-9]{128}$/;
export interface AdminConfig {
  hash: string;
  secret: string;
  origin: string;
  rateLimitId: string;
}
export interface Session {
  v: 1;
  iat: number;
  exp: number;
  csrf: string;
}

export function adminConfig(): AdminConfig {
  const hash = env("ADMIN_PASSWORD_HASH"),
    secret = env("ADMIN_SESSION_SECRET"),
    origin = env("ADMIN_ORIGIN"),
    rateLimitId = env("ADMIN_LOGIN_RATE_LIMIT_ID");
  if (
    !hash ||
    !passwordPattern.test(hash) ||
    !secret ||
    !/^[a-f0-9]{64,128}$/i.test(secret) ||
    !origin ||
    !rateLimitId ||
    !/^[\w-]{1,80}$/.test(rateLimitId)
  )
    throw new Error("Admin unavailable");
  const url = new URL(origin);
  if (url.origin !== origin || url.protocol !== "https:")
    throw new Error("Admin unavailable");
  return { hash, secret, origin, rateLimitId };
}
export function adminReady(): boolean {
  try {
    adminConfig();
    return true;
  } catch {
    return false;
  }
}
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  if (
    !passwordPattern.test(hash) ||
    !password.length ||
    Buffer.byteLength(password) > 1024
  )
    return false;
  const parts = hash.split("$");
  const derived = await new Promise<Buffer>((resolve, reject) =>
    scrypt(
      password,
      Buffer.from(parts[4]!, "hex"),
      64,
      { N: 131072, r: 8, p: 1, maxmem: 160 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    ),
  );
  return timingSafeEqual(derived, Buffer.from(parts[5]!, "hex"));
}
export function constantEqual(a: string, b: string): boolean {
  const first = Buffer.from(a),
    second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}
function signature(
  payload: string,
  purpose: string,
  config: AdminConfig,
): string {
  const key = createHmac("sha256", Buffer.from(config.secret, "hex"))
    .update(`mess-admin-key\0${config.hash}`)
    .digest();
  return createHmac("sha256", key)
    .update(`${purpose}\0${config.origin}\0${payload}`)
    .digest("base64url");
}
export function signToken(
  session: Session,
  purpose: "session" | "login",
  config = adminConfig(),
): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${signature(payload, purpose, config)}`;
}
export function readToken(
  token: string | undefined,
  purpose: "session" | "login",
  config = adminConfig(),
  now = Date.now(),
): Session | null {
  if (!token || token.length > 1024 || !/^[\w-]+\.[\w-]{43}$/.test(token))
    return null;
  const [payload, sig] = token.split(".") as [string, string];
  if (!constantEqual(sig, signature(payload, purpose, config))) return null;
  try {
    const s = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Session;
    const seconds = Math.floor(now / 1000),
      maxAge = purpose === "session" ? SESSION_SECONDS : 600;
    if (
      s.v !== 1 ||
      !Number.isSafeInteger(s.iat) ||
      !Number.isSafeInteger(s.exp) ||
      s.iat > seconds ||
      s.exp <= seconds ||
      s.exp <= s.iat ||
      s.exp - s.iat > maxAge ||
      !/^[\w-]{43}$/.test(s.csrf)
    )
      return null;
    return s;
  } catch {
    return null;
  }
}
export function newSession(
  seconds = SESSION_SECONDS,
  now = Date.now(),
): Session {
  const iat = Math.floor(now / 1000);
  return {
    v: 1,
    iat,
    exp: iat + seconds,
    csrf: randomBytes(32).toString("base64url"),
  };
}
export function setTokenCookie(
  cookies: AstroCookies,
  name: string,
  token: string,
  seconds: number,
) {
  cookies.set(name, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: seconds,
    expires: new Date(Date.now() + seconds * 1000),
  });
}
export function clearCookie(cookies: AstroCookies, name: string) {
  cookies.set(name, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}
