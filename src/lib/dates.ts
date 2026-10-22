import {
  eligible,
  meals,
  type Meal,
  type Menu,
  type SourceResult,
} from "./menu";

export function isDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(`${value}T12:00:00Z`)) &&
    new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value
  );
}
export function istDate(now = new Date()): string {
  return new Date(now.getTime() + 330 * 60_000).toISOString().slice(0, 10);
}
export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T12:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}
export function shortDate(date: string, weekday = false): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: weekday ? "long" : "short",
    ...(weekday ? { weekday: "long" as const } : {}),
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
export function checkedLabel(timestamp: string, now = new Date()): string {
  const date = new Date(timestamp);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);
  return `${istDate(date) === istDate(now) ? "" : `${shortDate(istDate(date))} · `}${time} IST`;
}
export function minutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h! * 60 + m!;
}
// Conservative service-window fallback only. These are not fallback dishes.
export const fallbackEnds: Record<Meal, number> = {
  breakfast: 600,
  lunch: 855,
  snacks: 1080,
  dinner: 1290,
};
export function defaultSelection(
  now: Date,
  results: SourceResult[],
  overrides = new Map<string, Menu>(),
): { date: string; meal: Meal } {
  const date = istDate(now);
  const local = new Date(now.getTime() + 330 * 60_000);
  const minute = local.getUTCHours() * 60 + local.getUTCMinutes();
  const ends = mealCutoffs(date, results, overrides);
  for (const [index, meal] of meals.entries()) {
    if (minute < ends[index]!) return { date, meal };
  }
  return { date: addDays(date, 1), meal: "breakfast" };
}
export function mealCutoffs(
  date: string,
  results: SourceResult[],
  overrides = new Map<string, Menu>(),
): number[] {
  return meals.map((meal) => {
    const ends = eligible(date, meal).map((mess) => {
      const menu =
        overrides.get(`${mess}/${meal}`) ??
        results.find((r) => r.snapshot?.mess === mess)?.snapshot?.meals[meal];
      return menu
        ? minutes(menu.end)
        : meal === "breakfast" &&
            new Date(`${date}T12:00:00Z`).getUTCDay() !== 0
          ? 570
          : fallbackEnds[meal];
    });
    return Math.max(...ends);
  });
}
