import { checkRateLimit } from "@vercel/firewall";
import { isIP } from "node:net";
import { adminConfig } from "./auth";
import { env } from "./env";
import { HttpError } from "./http";

export async function limitLogin(request: Request): Promise<void> {
  // The SDK intentionally returns success in dev; explicitly refuse that path.
  if (env("VERCEL") !== "1" || process.env.NODE_ENV !== "production")
    throw new HttpError(
      503,
      "Sign-in is temporarily unavailable. Please try again later.",
    );
  const config = adminConfig();
  const ip = request.headers.get("x-real-ip"); // Overwritten by Vercel, never x-forwarded-for supplied by a client.
  if (!ip || !isIP(ip))
    throw new HttpError(
      503,
      "Sign-in is temporarily unavailable. Please try again later.",
    );
  const headers = new Headers(request.headers);
  // Do not let an untrusted Host route a credential-bearing limiter request elsewhere.
  headers.set("host", new URL(config.origin).host);
  try {
    const result = await checkRateLimit(config.rateLimitId, {
      headers,
      rateLimitKey: ip,
      timeout: 5000,
    });
    if (result.error === "not-found") throw new Error("Inactive limiter");
    if (result.rateLimited || result.error === "blocked")
      throw new HttpError(
        429,
        "Unable to sign in. Please wait ten minutes and try again.",
      );
    if (result.error || result.rateLimited !== false)
      throw new Error("Invalid limiter response");
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(
      503,
      "Sign-in is temporarily unavailable. Please try again later.",
    );
  }
}
