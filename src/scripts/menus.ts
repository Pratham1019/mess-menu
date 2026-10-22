import type { Meal } from "../lib/menu";

const day = document.querySelector<HTMLElement>("[data-menu-date]");
const tabs = Array.from(
  document.querySelectorAll<HTMLAnchorElement>("[data-meal]"),
);
const panels = Array.from(
  document.querySelectorAll<HTMLElement>("[data-meal-panel]"),
);
const mealNames = ["breakfast", "lunch", "snacks", "dinner"] as const;
const isMeal = (value: unknown): value is Meal =>
  mealNames.includes(value as Meal);

if (day && tabs.length === 4 && panels.length === 4) {
  const date = day.dataset.menuDate!;
  const saved = document.documentElement.dataset.deviceCache === "true";
  const localNow = new Date(Date.now() + 330 * 60_000);
  const today = localNow.toISOString().slice(0, 10);
  const tomorrow = new Date(localNow.getTime() + 86_400_000)
    .toISOString()
    .slice(0, 10);
  const requested = new URL(location.href).searchParams.get("meal");
  let initial = isMeal(day.dataset.defaultMeal)
    ? day.dataset.defaultMeal
    : "breakfast";
  if (saved && date === today && !requested) {
    const minute = localNow.getUTCHours() * 60 + localNow.getUTCMinutes();
    const ends = day.dataset.mealEnds!.split(",").map(Number);
    initial =
      mealNames.find((_, index) => minute < ends[index]!) ?? "breakfast";
  } else if (saved && date > today && !requested) initial = "breakfast";
  if (isMeal(requested)) initial = requested;

  const options = document.querySelector(".meal-options");
  options?.setAttribute("role", "tablist");
  options?.setAttribute("aria-label", "Meal period");
  for (const tab of tabs) {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `panel-${tab.dataset.meal}`);
    tab.removeAttribute("aria-current");
  }
  for (const panel of panels) panel.setAttribute("role", "tabpanel");

  function render(meal: Meal, navigate = false) {
    for (const tab of tabs) {
      const selected = tab.dataset.meal === meal;
      tab.classList.toggle("selected", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.dataset.mealPanel !== meal;
    const label = tabs.find((tab) => tab.dataset.meal === meal)?.textContent;
    document.title = `${label} · ${day!.dataset.dateLabel} · The mess`;
    if (navigate) {
      const url = new URL(location.href);
      url.searchParams.set("meal", meal);
      url.searchParams.set("date", date);
      url.hash = "";
      if (url.href !== location.href) history.pushState(null, "", url);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  render(initial);
  for (const tab of tabs) {
    tab.addEventListener("click", (event) => {
      if (
        event.button ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const meal = tab.dataset.meal;
      if (!isMeal(meal)) return;
      event.preventDefault();
      render(meal, true);
    });
    tab.addEventListener("keydown", (event) => {
      let index = tabs.indexOf(tab);
      if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        index = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") index = 0;
      else if (event.key === "End") index = tabs.length - 1;
      else if (event.key !== " ") return;
      event.preventDefault();
      const next = tabs[index]!;
      render(next.dataset.meal as Meal, true);
      next.focus({ preventScroll: true });
    });
  }
  addEventListener("popstate", () => {
    const meal = new URL(location.href).searchParams.get("meal");
    render(isMeal(meal) ? meal : initial);
    window.scrollTo({ top: 0, behavior: "instant" });
  });

  // Measure the actual sticky control for anchor navigation and enlarged text.
  const nav = document.querySelector<HTMLElement>(".meal-nav");
  const toolbar = document.querySelector<HTMLElement>(".meal-toolbar");
  const offset = () => {
    const control = innerWidth >= 760 ? toolbar : nav;
    document.documentElement.style.setProperty(
      "--sticky-offset",
      `${Math.ceil(control?.getBoundingClientRect().height ?? 64) + 16}px`,
    );
  };
  offset();
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(offset);
    if (nav) observer.observe(nav);
    if (toolbar) observer.observe(toolbar);
  }

  if (saved) {
    const context = document.querySelector<HTMLElement>(".date-context");
    if (context) context.hidden = date !== tomorrow;
    const note = document.getElementById("device-cache-note");
    if (note) {
      note.hidden = false;
      note.append(
        document.createTextNode(
          `Showing saved menus for ${day.dataset.dateLabel}. `,
        ),
      );
      const refresh = document.createElement("a");
      refresh.href = location.href;
      refresh.textContent = "Refresh for the latest";
      note.append(refresh);
    }
  }

  // Save the already-rendered day, rather than fetching its menus a second time.
  // Registration exists only on the public reader, never on an admin page.
  async function saveOnDevice() {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    try {
      await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const registration = await navigator.serviceWorker.ready;
      if (saved) return;
      if (document.readyState !== "complete")
        await new Promise<void>((resolve) =>
          addEventListener("load", () => resolve(), { once: true }),
        );
      await document.fonts.ready;
      const resources = performance
        .getEntriesByType("resource")
        .map((entry) => entry.name);
      registration.active?.postMessage({
        type: "SAVE_DAY",
        html: "<!doctype html>" + document.documentElement.outerHTML,
        resources,
      });
    } catch {
      /* Denied storage or unsupported workers must not affect reading. */
    }
  }
  void saveOnDevice();
}
