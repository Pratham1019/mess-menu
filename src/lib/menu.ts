export const meals = ["breakfast", "lunch", "snacks", "dinner"] as const;
export const messes = ["fc1", "fc2", "sindhi"] as const;
export type Meal = (typeof meals)[number];
export type Mess = (typeof messes)[number];
export const labels: Record<Meal, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snacks: "Snacks",
  dinner: "Dinner",
};
export const sources: Record<Mess, { name: string; url: string }> = {
  fc1: { name: "FC1", url: "https://bluspring.vercel.app/" },
  fc2: { name: "FC2", url: "https://tikmit.com/" },
  sindhi: { name: "Sindhi", url: "https://sindhi.coolstuff.work/" },
};
export interface Dish {
  name: string;
  tags: string[];
}
export interface Section {
  title: string;
  items: Dish[];
}
export interface Menu {
  start: string;
  end: string;
  items: Dish[];
  sections: Section[];
  note: string;
}
export interface Snapshot {
  version: 1;
  mess: Mess;
  date: string;
  retrievedAt: string;
  dateBasis: "source" | "inferred";
  sourceLabel: string;
  meals: Partial<Record<Meal, Menu>>;
}
export interface Override {
  version: 1;
  date: string;
  mess: Mess;
  meal: Meal;
  savedAt: string;
  menu: Menu;
}
export interface SourceResult {
  snapshot: Snapshot | null;
  stale: boolean;
  unavailable: boolean;
}
export interface MenuView {
  mess: Mess;
  menu: Menu | null;
  snapshot: Snapshot | null;
  stale: boolean;
  override: Override | null;
}

export function isMeal(value: unknown): value is Meal {
  return meals.includes(value as Meal);
}
export function isMess(value: unknown): value is Mess {
  return messes.includes(value as Mess);
}
export function eligible(date: string, meal: Meal): Mess[] {
  return meal === "breakfast" ||
    meal === "snacks" ||
    new Date(`${date}T12:00:00Z`).getUTCDay() === 0
    ? ["fc1", "fc2"]
    : ["fc1", "fc2", "sindhi"];
}
export function displayName(value: string): string {
  const clean = value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/,\s*$/, "")
    .trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
