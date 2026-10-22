import snapshot from './menu-snapshot.json';

export type Meal = 'lunch' | 'dinner';
export type MessId = 'fc1' | 'fc2' | 'sindhi';

export interface SourceSection {
  kind: string;
  title: string;
  items: string[];
}

export interface MealSnapshot {
  time: string;
  items: string[];
  sections: SourceSection[];
}

export interface SourceSnapshot {
  label: string;
  url: string;
  dateNote: string;
  checked: string;
  meals: Record<Meal, MealSnapshot>;
}

// Authored research fixtures only. This prototype never calls a menu source.
export const menus = snapshot satisfies Record<MessId, SourceSnapshot>;
export const messOrder: readonly MessId[] = ['fc1', 'fc2', 'sindhi'];
export const meals: readonly Meal[] = ['lunch', 'dinner'];
export const mealLabel: Record<Meal, string> = { lunch: 'Lunch', dinner: 'Dinner' };
