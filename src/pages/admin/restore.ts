import type { APIRoute } from "astro";
import {
  checkCsrf,
  checkOrigin,
  HttpError,
  problem,
  readForm,
  requireSession,
} from "../../lib/server/http";
import { editorSelection, ValidationError } from "../../lib/validation";
import { deleteOverride } from "../../lib/server/storage";

export const POST: APIRoute = async (context) => {
  try {
    const session = requireSession(context);
    checkOrigin(context.request);
    const form = await readForm(
      context.request,
      ["csrf", "date", "mess", "meal"],
      4096,
    );
    checkCsrf(form, session);
    const { date, mess, meal } = editorSelection(form);
    await deleteOverride(date, mess, meal);
    return context.redirect(
      `/admin?date=${date}&mess=${mess}&meal=${meal}&restored=1`,
      303,
    );
  } catch (error) {
    return problem(
      error instanceof ValidationError
        ? new HttpError(400, error.message)
        : error,
    );
  }
};
export const ALL: APIRoute = () =>
  new Response("Method not allowed.", {
    status: 405,
    headers: { Allow: "POST" },
  });
