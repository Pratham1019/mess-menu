import { defineMiddleware } from "astro:middleware";
import { adminConfig, readToken, SESSION_COOKIE } from "./lib/server/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  let pathname: string;
  try {
    pathname = decodeURIComponent(context.url.pathname).replace(/\/+$/, "");
  } catch {
    return new Response("Invalid path", { status: 400 });
  }
  const admin = /^\/admin(?:\/|$)/i.test(pathname);
  let response: Response;
  if (admin) {
    let session = null;
    try {
      session = readToken(
        context.cookies.get(SESSION_COOKIE)?.value,
        "session",
        adminConfig(),
      );
    } catch {
      /* fail closed */
    }
    context.locals.adminSession = session;
    if (pathname !== "/admin/login" && !session) {
      response =
        context.request.method === "GET" || context.request.method === "HEAD"
          ? context.redirect("/admin/login", 303)
          : new Response("Sign in to continue.", { status: 401 });
    } else response = await next();
  } else response = await next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Native POST forms need a real Origin header for the exact-origin check.
  // no-referrer causes browsers to send Origin: null on these submissions.
  response.headers.set("Referrer-Policy", admin ? "same-origin" : "no-referrer");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (context.url.protocol === "https:")
    response.headers.set("Strict-Transport-Security", "max-age=31536000");
  if (admin) {
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'none'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    );
  }
  return response;
});
