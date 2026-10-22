import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { addDays, defaultSelection, isDate, shortDate } from "../src/lib/dates";
import { eligible, type Menu } from "../src/lib/menu";
import { editorMenu, editorSelection, parseMenu } from "../src/lib/validation";
import {
  fc1Snapshot,
  fc2Snapshot,
  sindhiSnapshot,
} from "../src/lib/ingestion/adapters";
import { extractFc1 } from "../src/lib/ingestion/fc1-literal";
import { overridePath } from "../src/lib/server/storage";

const now = new Date("2026-10-22T12:00:00Z");
const load = (name: string) =>
  JSON.parse(readFileSync(`research/evidence/${name}`, "utf8")) as unknown;
const fixture = readFileSync("research/evidence/fc1-menu-literal.txt", "utf8");
const payload = extractFc1(
  `function local(){const names=2;} const names=${fixture}; const configuration=[{key:'Food Court-1',data:names}];`,
);
const fc1 = fc1Snapshot(
  payload,
  "2026-10-22",
  now,
  "Wed, 21 Oct 2026 07:23:29 GMT",
)!;
const fc2 = fc2Snapshot(load("fc2-menu-2026-10-22.json"), "2026-10-22", now)!;
const sindhi = sindhiSnapshot(
  load("sindhi-week-2026-10-19.json"),
  "2026-10-22",
  now,
)!;
const results = [fc1, fc2, sindhi].map((snapshot) => ({
  snapshot,
  stale: false,
  unavailable: false,
}));
const ist = (time: string) => new Date(`2026-10-22T${time}+05:30`);

test("each adapter preserves actual dishes, sections, tags, serving times and dates", () => {
  assert.equal(fc1.meals.breakfast?.items.length, 11);
  assert.equal(fc1.meals.lunch?.items[0]?.name, "LAUKI CHANNA KOOTU");
  assert.deepEqual(
    fc1.meals.dinner?.items.find((i) => i.name === "HARLIYALI EGG")?.tags,
    ["nonveg"],
  );
  assert.equal(fc2.meals.lunch?.items.length, 10);
  assert.equal(fc2.meals.lunch?.end, "14:15");
  assert.deepEqual(fc2.meals.dinner?.items[1]?.tags, [
    "non-veg",
    "non-veg-special",
  ]);
  assert.equal(sindhi.meals.lunch?.sections[2]?.title, "Veg Sides");
  assert.equal(sindhi.meals.lunch?.items.length, 6);
  assert.equal(sindhi.sourceLabel, "Menu 3 · rotating schedule");
  assert.equal(
    fc2Snapshot(load("fc2-menu-2026-10-22.json"), "2026-10-23", now),
    null,
  );
  assert.equal(
    sindhiSnapshot(load("sindhi-week-2026-10-19.json"), "2026-10-25", now),
    null,
  );
});
test("FC1 requires complete, consecutive dates and a recent deployment; downloaded expressions never execute", () => {
  assert.equal(fc1Snapshot(payload, "2026-10-22", now, null), null);
  assert.equal(
    fc1Snapshot(payload, "2026-10-22", now, "Mon, 21 Sep 2026 07:23:29 GMT"),
    null,
  );
  assert.equal(
    fc1Snapshot(
      payload,
      "2027-10-22",
      new Date("2027-10-22T12:00:00Z"),
      "Wed, 21 Oct 2026 07:23:29 GMT",
    ),
    null,
  );
  assert.equal(
    fc1Snapshot(payload, "2026-10-28", now, "Wed, 21 Oct 2026 07:23:29 GMT"),
    null,
  );
  assert.throws(() =>
    extractFc1(
      `const a={Monday: stealSecrets()}; const conf=[{key:'Food Court-1',data:a}];`,
    ),
  );
  assert.throws(() =>
    extractFc1(
      `const a={__proto__:{}}; const conf=[{key:'Food Court-1',data:a}];`,
    ),
  );
  assert.throws(() =>
    extractFc1(`const a={}; const conf=[{key:'Wrong mess',data:a}];`),
  );
});
test("IST selection advances at exact latest serving ends, including next-day breakfast after dinner", () => {
  for (const [time, meal, date] of [
    ["00:00:00", "breakfast", "2026-10-22"],
    ["09:29:59", "breakfast", "2026-10-22"],
    ["09:30:00", "lunch", "2026-10-22"],
    ["14:14:59", "lunch", "2026-10-22"],
    ["14:15:00", "snacks", "2026-10-22"],
    ["17:59:59", "snacks", "2026-10-22"],
    ["18:00:00", "dinner", "2026-10-22"],
    ["21:29:59", "dinner", "2026-10-22"],
    ["21:30:00", "breakfast", "2026-10-23"],
    ["23:59:59", "breakfast", "2026-10-23"],
  ])
    assert.deepEqual(defaultSelection(ist(time!), results), { meal, date });
  const override = { ...fc2.meals.dinner!, end: "22:00" };
  assert.equal(
    defaultSelection(
      ist("21:30:00"),
      results,
      new Map([["fc2/dinner", override]]),
    ).meal,
    "dinner",
  );
  assert.deepEqual(
    defaultSelection(
      ist("22:00:00"),
      results,
      new Map([["fc2/dinner", override]]),
    ),
    { date: "2026-10-23", meal: "breakfast" },
  );
  assert.deepEqual(defaultSelection(new Date("2026-12-31T16:00:00Z"), []), {
    date: "2027-01-01",
    meal: "breakfast",
  });
});
test("eligibility and real calendar dates handle Sundays, leap days and year boundaries", () => {
  assert.deepEqual(eligible("2026-10-25", "lunch"), ["fc1", "fc2"]);
  assert.deepEqual(eligible("2026-10-22", "breakfast"), ["fc1", "fc2"]);
  assert.deepEqual(eligible("2026-10-22", "dinner"), ["fc1", "fc2", "sindhi"]);
  assert.equal(isDate("2026-02-30"), false);
  assert.equal(isDate("2028-02-29"), true);
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(shortDate("2026-10-22").includes("2026"), false);
});
test("admin validates menu size, section consistency, serving times, eligible dates and storage paths", () => {
  const valid: Menu = {
    start: "12:00",
    end: "14:00",
    items: [{ name: "Dal", tags: [] }],
    sections: [],
    note: "",
  };
  assert.deepEqual(parseMenu(valid), valid);
  for (const value of [
    { ...valid, start: "25:00" },
    { ...valid, end: "11:00" },
    { ...valid, items: Array(61).fill({ name: "Dal", tags: [] }) },
    { ...valid, items: [{ name: "x".repeat(161), tags: [] }] },
    {
      ...valid,
      sections: [{ title: "Veg", items: [{ name: "Rice", tags: [] }] }],
    },
    { ...valid, note: "x".repeat(301) },
    { ...valid, items: [] },
  ])
    assert.throws(() => parseMenu(value));
  const form = new URLSearchParams({
    date: "2026-10-22",
    mess: "fc1",
    meal: "lunch",
    start: "12:00",
    end: "14:00",
    items: "Dal\nRice",
    tags: "[]",
    sections: "[]",
  });
  assert.equal(editorMenu(form).items.length, 2);
  assert.deepEqual(editorSelection(form, now), {
    date: "2026-10-22",
    mess: "fc1",
    meal: "lunch",
  });
  const invalid: Record<string, string>[] = [
    { date: "2026-10-25", mess: "sindhi" },
    { date: "2027-01-01" },
    { mess: "../../secrets" },
    { meal: "brunch" },
  ];
  for (const patch of invalid)
    assert.throws(() =>
      editorSelection(
        new URLSearchParams({ ...Object.fromEntries(form), ...patch }),
        now,
      ),
    );
  assert.throws(() => overridePath("../../secrets", "fc1", "lunch"));
});
