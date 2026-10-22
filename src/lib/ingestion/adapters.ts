import { addDays, isDate } from "../dates";
import { labels, meals, type Menu, type Snapshot } from "../menu";
import {
  array,
  object,
  parseDish,
  parseMenu,
  parseSnapshot,
  text,
} from "../validation";

function apiMeal(value: unknown): Menu {
  const m = object(value);
  return parseMenu({
    start: m.startTime,
    end: m.endTime,
    items: array(m.items).map(parseDish),
    sections: array(m.sections ?? [], 8).map((s) => {
      const section = object(s);
      return {
        title: section.title,
        items: array(section.items).map(parseDish),
      };
    }),
    note: "",
  });
}
export function fc2Snapshot(
  payload: unknown,
  date: string,
  now: Date,
): Snapshot | null {
  const root = object(payload);
  if (root.foodCourt !== "Food Court 2") throw new Error("Wrong source");
  const day = object(root.menu)[date];
  if (!day) return null;
  if (
    object(day).day !==
    new Intl.DateTimeFormat("en", { weekday: "long", timeZone: "UTC" }).format(
      new Date(`${date}T12:00:00Z`),
    )
  )
    throw new Error("Weekday mismatch");
  const parsed: Snapshot["meals"] = {};
  const raw = object(object(day).meals);
  for (const meal of meals) if (raw[meal]) parsed[meal] = apiMeal(raw[meal]);
  return parseSnapshot({
    version: 1,
    mess: "fc2",
    date,
    retrievedAt: now.toISOString(),
    dateBasis: "source",
    sourceLabel: "Dated schedule",
    meals: parsed,
  });
}
export function sindhiSnapshot(
  payload: unknown,
  date: string,
  now: Date,
): Snapshot | null {
  const root = object(payload);
  if (root.foodCourt !== "Sindhi Mess") throw new Error("Wrong source");
  const match = /^([\d-]{10})_to_([\d-]{10})$/.exec(text(root.id, 40));
  if (
    !match ||
    !isDate(match[1]) ||
    !isDate(match[2]) ||
    date < match[1] ||
    date > match[2]
  )
    return null;
  const weekday = new Intl.DateTimeFormat("en", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
  if (weekday === "Sunday") return null;
  const day = object(object(root.menu)[weekday]);
  const sourceDate = new Date(`${date}T12:00:00Z`);
  const display = `${new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(sourceDate)} ${sourceDate.getUTCDate()}`;
  if (day.day !== weekday || day.displayDate !== display)
    throw new Error("Date mismatch");
  const raw = object(day.meals),
    parsed: Snapshot["meals"] = {};
  for (const meal of ["lunch", "dinner"] as const)
    if (raw[meal]) parsed[meal] = apiMeal(raw[meal]);
  const rotation = /^\/menu([1-4])\.json$/.exec(String(root.source));
  return parseSnapshot({
    version: 1,
    mess: "sindhi",
    date,
    retrievedAt: now.toISOString(),
    dateBasis: "source",
    sourceLabel: rotation
      ? `Menu ${rotation[1]} · rotating schedule`
      : "Rotating schedule",
    meals: parsed,
  });
}

export function fc1Snapshot(
  payload: unknown,
  date: string,
  now: Date,
  lastModified: string | null,
): Snapshot | null {
  const root = object(payload);
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  if (
    Object.keys(root).length !== 7 ||
    Object.keys(root).some((key) => !weekdays.includes(key))
  )
    throw new Error("Invalid FC1 week");
  // FC1 omits the year. Only infer it from a recent deployment and a complete,
  // consecutive seven-day sequence with matching weekdays, never the viewer date.
  const modified = lastModified ? new Date(lastModified) : null;
  if (
    !modified ||
    !Number.isFinite(+modified) ||
    +modified > +now + 300_000 ||
    +now - +modified > 30 * 86_400_000
  )
    return null;
  const candidates: string[][] = [];
  for (
    let year = modified.getUTCFullYear() - 1;
    year <= modified.getUTCFullYear() + 1;
    year++
  ) {
    const dates: string[] = [];
    for (const [weekday, raw] of Object.entries(root)) {
      const m = /^(\d{1,2})(?:st|nd|rd|th)-([A-Z]{3})$/.exec(
        text(object(raw).date, 20),
      );
      if (!m) throw new Error("Unknown FC1 date format");
      const month = monthNames.indexOf(m[2]!);
      const candidate = `${year}-${String(month + 1).padStart(2, "0")}-${m[1]!.padStart(2, "0")}`;
      if (
        month < 0 ||
        !isDate(candidate) ||
        weekdays[new Date(`${candidate}T12:00:00Z`).getUTCDay()] !== weekday
      )
        break;
      dates.push(candidate);
    }
    dates.sort();
    if (
      dates.length === 7 &&
      dates.every((d, i) => d === addDays(dates[0]!, i)) &&
      Math.abs(Date.parse(dates[0]!) - +modified) < 14 * 86_400_000
    )
      candidates.push(dates);
  }
  if (candidates.length !== 1 || !candidates[0]!.includes(date)) return null;
  const day = object(
    root[weekdays[new Date(`${date}T12:00:00Z`).getUTCDay()]!],
  );
  const parsed: Snapshot["meals"] = {};
  for (const meal of meals) {
    const m = object(day[labels[meal]]);
    const match =
      /^(\d{1,2}):(\d{2}) (AM|PM) - (\d{1,2}):(\d{2}) (AM|PM)$/.exec(
        text(m.time, 40),
      );
    if (!match) throw new Error("Invalid FC1 serving time");
    const clock = (hour: string, minute: string, period: string) => {
      if (+hour < 1 || +hour > 12) throw new Error("Invalid hour");
      return `${String((+hour % 12) + (period === "PM" ? 12 : 0)).padStart(2, "0")}:${minute}`;
    };
    parsed[meal] = parseMenu({
      start: clock(match[1]!, match[2]!, match[3]!),
      end: clock(match[4]!, match[5]!, match[6]!),
      items: array(m.items).map((item) => {
        const raw = object(item);
        const type = text(raw.type, 32);
        return { name: raw.name, tags: [type] };
      }),
      sections: [],
      note: m.note ?? "",
    });
  }
  return parseSnapshot({
    version: 1,
    mess: "fc1",
    date,
    retrievedAt: now.toISOString(),
    dateBasis: "inferred",
    sourceLabel: "Source date matched to recent deployment",
    meals: parsed,
  });
}
