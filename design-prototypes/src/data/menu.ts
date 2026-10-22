import snapshot from './menu-snapshot.json';
export type Meal = 'breakfast' | 'lunch' | 'snacks' | 'dinner';
export type Direction = 'modern' | 'editorial' | 'hybrid';
export type Mess = 'fc1' | 'fc2' | 'sindhi';
export interface Menu { time: string; items: string[]; sections: {kind: string; title: string; items: string[]}[] }
export interface Source { label: string; url: string; dateNote: string; checked: string; meals: Partial<Record<Meal, Menu>> }
export const data: Record<Mess, Source> = snapshot;
export const meals: readonly Meal[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
export const labels: Record<Meal,string> = { breakfast:'Breakfast', lunch:'Lunch', snacks:'Snacks', dinner:'Dinner' };
export const eligible = (meal: Meal): Mess[] => meal === 'breakfast' || meal === 'snacks' ? ['fc1','fc2'] : ['fc1','fc2','sindhi'];
// Presentation case/spacing only. Preserve original names without translation or inferred categories.
export function displayName(value: string): string {
 const s=value.toLowerCase().replace(/\s+/g,' ').replace(/\s*,\s*/g,', ').replace(/,\s*$/,'').trim();
 return s.charAt(0).toUpperCase()+s.slice(1);
}
