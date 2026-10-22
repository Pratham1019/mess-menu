import type { APIRoute } from "astro";
import {
  clearCookie,
  LOGIN_COOKIE,
  SESSION_COOKIE,
} from "../../lib/server/auth";
import {
  checkCsrf,
  checkOrigin,
  problem,
  readForm,
  requireSession,
} from "../../lib/server/http";

export const POST: APIRoute = async (context) => {
  try {
    const session = requireSession(context);
    checkOrigin(context.request);
    const form = await readForm(context.request, ["csrf"], 4096);
    checkCsrf(form, session);
    clearCookie(context.cookies, SESSION_COOKIE);
    clearCookie(context.cookies, LOGIN_COOKIE);
    return context.redirect("/admin/login", 303);
  } catch (error) {
    return problem(error);
  }
};
export const ALL: APIRoute = () =>
  new Response("Method not allowed.", {
    status: 405,
    headers: { Allow: "POST" },
  });
