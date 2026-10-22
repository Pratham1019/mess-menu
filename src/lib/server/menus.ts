import {
  eligible,
  messes,
  meals,
  type Meal,
  type MenuView,
  type Mess,
  type Snapshot,
  type SourceResult,
} from "../menu";
import {
  fc1Snapshot,
  fc2Snapshot,
  sindhiSnapshot,
} from "../ingestion/adapters";
import { fetchSource } from "../ingestion/fetch";
import { extractFc1 } from "../ingestion/fc1-literal";
import { readOverride, readSnapshot, writeSnapshot } from "./storage";

async function liveSnapshot(
  mess: Mess,
  date: string,
  now: Date,
): Promise<Snapshot | null> {
  if (mess === "fc2")
    return fc2Snapshot(
      JSON.parse(
        (
          await fetchSource(
            `https://tikm.coolstuff.work/api/menu?date=${date}&v=2`,
          )
        ).body,
      ),
      date,
      now,
    );
  if (mess === "sindhi") {
    if (!eligible(date, "lunch").includes("sindhi")) return null;
    return sindhiSnapshot(
      JSON.parse(
        (await fetchSource("https://sindhi.coolstuff.work/api/menu")).body,
      ),
      date,
      now,
    );
  }
  const page = await fetchSource("https://bluspring.vercel.app/", 50_000);
  const scripts = [
    ...page.body.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi),
  ].map((m) => new URL(m[1]!, "https://bluspring.vercel.app/"));
  const candidates = scripts.filter(
    (u) =>
      u.origin === "https://bluspring.vercel.app" &&
      /^\/assets\/[\w.-]+\.js$/.test(u.pathname) &&
      !u.search,
  );
  if (candidates.length !== 1) throw new Error("FC1 source structure changed");
  const asset = await fetchSource(candidates[0]!.href, 1_000_000);
  return fc1Snapshot(
    extractFc1(asset.body),
    date,
    now,
    asset.modified ?? page.modified,
  );
}
export async function sourceMenu(
  mess: Mess,
  date: string,
  now = new Date(),
): Promise<SourceResult> {
  let cached: Snapshot | null = null;
  try {
    cached = await readSnapshot(date, mess);
  } catch {
    /* live source remains independent */
  }
  const age = cached ? +now - Date.parse(cached.retrievedAt) : Infinity;
  if (cached && age >= 0 && age < 60_000)
    return { snapshot: cached, stale: false, unavailable: false };
  try {
    const snapshot = await liveSnapshot(mess, date, now);
    if (snapshot) {
      try {
        await writeSnapshot(snapshot);
      } catch {
        /* a cache write cannot hide a valid source */
      }
      return { snapshot, stale: false, unavailable: false };
    }
  } catch {
    /* isolate unavailable, invalid, or structurally changed sources */
  }
  // A dated cache is useful, but never keep an indefinitely stale schedule.
  if (cached && age >= 0 && age < 7 * 86_400_000)
    return { snapshot: cached, stale: true, unavailable: true };
  return { snapshot: null, stale: false, unavailable: true };
}
export async function allSources(
  date: string,
  now = new Date(),
): Promise<SourceResult[]> {
  return Promise.all(messes.map((mess) => sourceMenu(mess, date, now)));
}
export async function menuViews(
  date: string,
  meal: Meal,
  results: SourceResult[],
): Promise<{ views: MenuView[]; storageError: boolean }> {
  let storageError = false;
  const views = await Promise.all(
    eligible(date, meal).map(async (mess) => {
      const result = results.find((r) => r.snapshot?.mess === mess);
      let override = null;
      try {
        override = await readOverride(date, mess, meal);
      } catch {
        storageError = true;
      }
      const snapshot = result?.snapshot ?? null;
      return {
        mess,
        snapshot,
        menu: override?.menu ?? snapshot?.meals[meal] ?? null,
        stale: !override && Boolean(result?.stale),
        override,
      };
    }),
  );
  return { views, storageError };
}

export async function dayMenus(date: string, now = new Date()) {
  const results = await allSources(date, now);
  const entries = await Promise.all(
    meals.map(
      async (meal) => [meal, await menuViews(date, meal, results)] as const,
    ),
  );
  const byMeal = Object.fromEntries(entries) as Record<
    Meal,
    Awaited<ReturnType<typeof menuViews>>
  >;
  const overrides = new Map<string, NonNullable<MenuView["menu"]>>();
  for (const [meal, { views }] of entries)
    for (const view of views) {
      if (view.override)
        overrides.set(`${view.mess}/${meal}`, view.override.menu);
    }
  return { results, byMeal, overrides };
}
