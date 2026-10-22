import type { APIContext } from "astro";
import {
  adminConfig,
  constantEqual,
  readToken,
  SESSION_COOKIE,
  type Session,
} from "./auth";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function checkOrigin(request: Request, origin = adminConfig().origin) {
  if (
    request.headers.get("origin") !== origin ||
    ["cross-site", "same-site"].includes(
      request.headers.get("sec-fetch-site") ?? "",
    )
  )
    throw new HttpError(
      403,
      "Request could not be verified. Reload the page and try again.",
    );
}
export async function boundedText(
  stream: ReadableStream<Uint8Array> | null,
  limit: number,
): Promise<string> {
  if (!stream) return "";
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new HttpError(413, "Submitted data is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(
      Buffer.concat(chunks),
    );
  } catch {
    throw new HttpError(400, "Invalid text encoding.");
  }
}
export async function readForm(
  request: Request,
  fields: readonly string[],
  limit = 65_536,
): Promise<URLSearchParams> {
  if (request.method !== "POST")
    throw new HttpError(405, "Method not allowed.");
  if (
    request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !==
    "application/x-www-form-urlencoded"
  )
    throw new HttpError(415, "Submit the form from this page.");
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > limit))
    throw new HttpError(413, "Submitted data is too large.");
  const body = await boundedText(request.body, limit);
  try {
    decodeURIComponent(body.replace(/\+/g, " "));
  } catch {
    throw new HttpError(400, "Invalid form encoding.");
  }
  const form = new URLSearchParams(body);
  for (const key of form.keys())
    if (!fields.includes(key) || form.getAll(key).length !== 1)
      throw new HttpError(400, "Invalid form fields.");
  return form;
}
export function requireSession(context: Pick<APIContext, "cookies">): Session {
  const session = readToken(
    context.cookies.get(SESSION_COOKIE)?.value,
    "session",
  );
  if (!session) throw new HttpError(401, "Sign in again to continue.");
  return session;
}
export function checkCsrf(form: URLSearchParams, session: Session) {
  const token = form.get("csrf");
  if (!token || !constantEqual(token, session.csrf))
    throw new HttpError(
      403,
      "Request could not be verified. Reload the page and try again.",
    );
}
export function problem(error: unknown): Response {
  const status = error instanceof HttpError ? error.status : 503;
  const message =
    error instanceof HttpError
      ? error.message
      : "This action is temporarily unavailable. Please try again.";
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
