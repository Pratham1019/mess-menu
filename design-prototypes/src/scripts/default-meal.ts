import type { Meal } from '../data/menu';

export interface MealCutoff {
  meal: Meal;
  endMinutes: number;
}

/** Keep a meal until the last eligible mess closes; otherwise show the next one. */
export function defaultMeal(now: Date, cutoffs: readonly MealCutoff[]): Meal {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(now);
  const hour = Number(parts.find(part => part.type === 'hour')?.value);
  const minute = Number(parts.find(part => part.type === 'minute')?.value);
  const minutes = hour * 60 + minute;
  return cutoffs.find(cutoff => minutes < cutoff.endMinutes)?.meal ?? 'breakfast';
}
