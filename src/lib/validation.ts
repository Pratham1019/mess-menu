import { isDate, istDate } from "./dates";
import {
  eligible,
  isMeal,
  isMess,
  type Dish,
  type Menu,
  type Override,
  type Snapshot,
} from "./menu";

export class ValidationError extends Error {}
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new ValidationError("Expected an object.");
  return value as Record<string, unknown>;
}
export function text(value: unknown, max = 160, empty = false): string {
  if (
    typeof value !== "string" ||
    value.length > max ||
    /[\u0000-\u0008\u000b-\u001f\u007f]/.test(value)
  )
    throw new ValidationError(`Text must be at most ${max} characters.`);
  const result = value.trim();
  if (!empty && !result) throw new ValidationError("Text cannot be empty.");
  return result;
}
export function array(value: unknown, max = 60): unknown[] {
  if (!Array.isArray(value) || value.length > max)
    throw new ValidationError(`Expected at most ${max} entries.`);
  return value;
}
export function parseDish(value: unknown): Dish {
  if (typeof value === "string") return { name: text(value), tags: [] };
  const item = object(value);
  return {
    name: text(item.name),
    tags: array(item.tags ?? [], 8).map((t) => text(t, 32)),
  };
}
export function parseMenu(value: unknown): Menu {
  const m = object(value);
  const start = text(m.start, 5),
    end = text(m.end, 5);
  if (
    ![start, end].every((t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t)) ||
    start >= end
  )
    throw new ValidationError("Enter a valid serving start and end time.");
  const items = array(m.items).map(parseDish);
  const sections = array(m.sections ?? [], 8).map((s) => {
    const section = object(s);
    return {
      title: text(section.title, 60),
      items: array(section.items).map(parseDish),
    };
  });
  const sectionItems = sections.flatMap((s) => s.items);
  if (sectionItems.length > 60)
    throw new ValidationError("Use at most 60 dishes in total.");
  // A grouped source must account for every dish, in its original order, exactly once.
  if (sections.length && JSON.stringify(items) !== JSON.stringify(sectionItems))
    throw new ValidationError(
      "Section dishes must match the complete dish list in order.",
    );
  const note = text(m.note ?? "", 300, true);
  if (!items.length && !note)
    throw new ValidationError("Enter at least one dish or a source note.");
  return { start, end, items, sections, note };
}
export function parseSnapshot(value: unknown): Snapshot {
  const s = object(value);
  if (
    s.version !== 1 ||
    !isMess(s.mess) ||
    !isDate(s.date) ||
    !["source", "inferred"].includes(String(s.dateBasis))
  )
    throw new ValidationError("Invalid source snapshot.");
  const rawMeals = object(s.meals);
  const parsed: Snapshot["meals"] = {};
  for (const key of Object.keys(rawMeals)) {
    if (!isMeal(key) || !eligible(s.date, key).includes(s.mess))
      throw new ValidationError("Invalid source meal.");
    parsed[key] = parseMenu(rawMeals[key]);
  }
  if (!Object.keys(parsed).length) throw new ValidationError("Empty schedule.");
  return {
    version: 1,
    mess: s.mess,
    date: s.date,
    dateBasis: s.dateBasis as Snapshot["dateBasis"],
    sourceLabel: text(s.sourceLabel, 80),
    retrievedAt: timestamp(s.retrievedAt),
    meals: parsed,
  };
}
function timestamp(value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length > 30 ||
    !Number.isFinite(Date.parse(value))
  )
    throw new ValidationError("Invalid timestamp.");
  return new Date(value).toISOString();
}
export function parseOverride(value: unknown): Override {
  const v = object(value);
  if (
    v.version !== 1 ||
    !isDate(v.date) ||
    !isMess(v.mess) ||
    !isMeal(v.meal) ||
    !eligible(v.date, v.meal).includes(v.mess)
  )
    throw new ValidationError("Invalid menu override.");
  return {
    version: 1,
    date: v.date,
    mess: v.mess,
    meal: v.meal,
    savedAt: timestamp(v.savedAt),
    menu: parseMenu(v.menu),
  };
}
export function editorSelection(form: URLSearchParams, now = new Date()) {
  const date = form.get("date"),
    mess = form.get("mess"),
    meal = form.get("meal");
  if (!isDate(date) || !isMess(mess) || !isMeal(meal))
    throw new ValidationError("Choose a valid date, mess and meal.");
  if (Math.abs(Date.parse(date) - Date.parse(istDate(now))) > 31 * 86_400_000)
    throw new ValidationError("Choose a date within 31 days of today.");
  if (!eligible(date, meal).includes(mess))
    throw new ValidationError(
      "Sindhi serves Lunch and Dinner, Monday to Saturday.",
    );
  return { date, mess, meal };
}
export function editorMenu(form: URLSearchParams): Menu {
  let sections: unknown = [];
  try {
    sections = JSON.parse(form.get("sections") || "[]");
  } catch {
    throw new ValidationError("Sections must be valid JSON.");
  }
  const lines = (form.get("items") ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  let tags: unknown;
  try {
    tags = JSON.parse(form.get("tags") || "[]");
  } catch {
    throw new ValidationError("Dish tags must be valid JSON.");
  }
  const itemTags = array(tags);
  if (itemTags.length && itemTags.length !== lines.length)
    throw new ValidationError("Provide one tag array per dish.");
  return parseMenu({
    start: form.get("start"),
    end: form.get("end"),
    items: lines.map((name, i) => ({ name, tags: itemTags[i] ?? [] })),
    sections,
    note: form.get("note") ?? "",
  });
}
