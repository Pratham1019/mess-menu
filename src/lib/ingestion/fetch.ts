import { boundedText } from "../server/http";

const hosts = new Set([
  "bluspring.vercel.app",
  "tikm.coolstuff.work",
  "sindhi.coolstuff.work",
]);
export async function fetchSource(
  url: string,
  limit = 200_000,
): Promise<{ body: string; modified: string | null }> {
  const parsed = new URL(url);
  if (
    parsed.protocol !== "https:" ||
    !hosts.has(parsed.host) ||
    parsed.username ||
    parsed.password
  )
    throw new Error("Untrusted source");
  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(7000),
    headers: {
      "User-Agent": "The-Mess/1.0 (MIT Manipal menu reader)",
      Accept: "application/json, text/html, text/javascript",
    },
  });
  if (!response.ok) throw new Error("Source unavailable");
  if (Number(response.headers.get("content-length")) > limit) {
    await response.body?.cancel();
    throw new Error("Source too large");
  }
  return {
    body: await boundedText(response.body, limit),
    modified: response.headers.get("last-modified"),
  };
}
