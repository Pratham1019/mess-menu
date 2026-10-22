import type { Meal } from '../data/menu';

const tabs = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-meal]'));
const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-panel]'));
const root = document.documentElement;
const announcement = document.querySelector<HTMLElement>('#meal-announcement');

function applyScenario() {
  const mixed = new URLSearchParams(location.search).get('scenario') === 'mixed';
  root.dataset.scenario = mixed ? 'mixed' : 'complete';
  document.querySelectorAll<HTMLElement>('.only-mixed').forEach((element) => { element.hidden = !mixed; });
  document.querySelectorAll<HTMLElement>('.hide-when-mixed').forEach((element) => { element.hidden = mixed; });
  tabs.forEach((tab) => {
    const url = new URL(tab.href);
    if (mixed) url.searchParams.set('scenario', 'mixed');
    else url.searchParams.delete('scenario');
    tab.href = url.pathname + url.search;
  });
}

function selectMeal(meal: Meal, updateHistory: boolean, returnToStart: boolean) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.meal === meal;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== meal; });
  document.querySelectorAll<HTMLAnchorElement>('[data-jump]').forEach((anchor) => {
    anchor.href = `#${meal}-${anchor.dataset.jump}`;
  });
  if (updateHistory) history.pushState({ meal }, '', `/${meal}/${location.search}`);
  if (returnToStart) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (announcement) announcement.textContent = `${meal === 'lunch' ? 'Lunch' : 'Dinner'} menus. FC1, FC2, and Sindhi.`;
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const meal = tab.dataset.meal;
    if (meal === 'lunch' || meal === 'dinner') selectMeal(meal, tab.getAttribute('aria-selected') !== 'true', true);
  });
  tab.addEventListener('keydown', (event) => {
    if (event.key === ' ') { event.preventDefault(); tab.click(); return; }
    let next: HTMLAnchorElement | undefined;
    if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
    if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs[tabs.length - 1];
    if (next) { event.preventDefault(); next.focus(); next.click(); }
  });
});

window.addEventListener('popstate', () => {
  applyScenario();
  selectMeal(location.pathname.startsWith('/dinner') ? 'dinner' : 'lunch', false, true);
});

applyScenario();
selectMeal(location.pathname.startsWith('/dinner') ? 'dinner' : 'lunch', false, false);
