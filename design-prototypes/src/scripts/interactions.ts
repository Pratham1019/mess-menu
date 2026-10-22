import {meals,labels, type Meal} from '../data/menu';
import {defaultMeal, type MealCutoff} from './default-meal';
const tabs=Array.from(document.querySelectorAll<HTMLAnchorElement>('.meal'));
const direction=document.body.classList.contains('hybrid')?'hybrid':document.body.classList.contains('modern')?'modern':'editorial';
const directionTitle=direction==='hybrid'?'Refined hybrid':direction==='modern'?'Modern utility':'Editorial utility';
function currentMeal(): Meal {const m=location.pathname.split('/')[2];return meals.includes(m as Meal)?m as Meal:'lunch';}
function render(meal: Meal, navigate=false){
 for(const tab of tabs){const selected=tab.dataset.meal===meal;tab.classList.toggle('selected',selected);tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;}
 for(const m of meals){const panel=document.getElementById(`panel-${m}`);if(panel)panel.hidden=m!==meal;}
 document.body.dataset.meal=meal;
 document.title=`Mess menus · ${labels[meal]} · ${directionTitle}`;
 if(navigate){history.pushState({},'',`/${direction}/${meal}/${location.search}`);window.scrollTo({top:0,behavior:'instant'});}
}
for(const tab of tabs){
 tab.addEventListener('click',event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();render(tab.dataset.meal as Meal,true);});
 tab.addEventListener('keydown',event=>{let index=meals.indexOf(tab.dataset.meal as Meal);if(event.key==='ArrowRight')index=(index+1)%4;else if(event.key==='ArrowLeft')index=(index+3)%4;else if(event.key==='Home')index=0;else if(event.key==='End')index=3;else if(event.key===' '){event.preventDefault();render(tab.dataset.meal as Meal,true);return;}else return;event.preventDefault();const target=meals[index];if(target){render(target,true);tabs[index]?.focus({preventScroll:true});}});
}
const mixed=new URLSearchParams(location.search).get('scenario')==='mixed';
if(mixed){document.body.dataset.scenario='mixed';for(const n of document.querySelectorAll<HTMLElement>('.simulation,[data-mess="fc1"] [data-state="cached"],[data-mess="fc2"] [data-state="missing"]'))n.hidden=false;for(const food of document.querySelectorAll<HTMLElement>('[data-mess="fc2"] .food'))food.hidden=true;for(const note of document.querySelectorAll<HTMLElement>('[data-mess="fc2"] .source-note'))note.textContent='Source unavailable · retained snapshot';for(const stamp of document.querySelectorAll<HTMLElement>('[data-mess="fc1"] .retrieved,[data-mess="fc2"] .retrieved'))stamp.textContent=`Last retrieved · 22 Oct, ${stamp.dataset.retrieved} IST`;}
for(const tab of tabs)if(mixed)tab.href+='?scenario=mixed';
window.addEventListener('popstate',()=>{render(currentMeal());window.scrollTo({top:0,behavior:'instant'});});
if(document.body.dataset.automaticMeal==='true'){
 const raw: unknown=JSON.parse(document.body.dataset.mealCutoffs ?? 'null');
 if(!Array.isArray(raw) || raw.length!==meals.length || !raw.every((value: unknown,index: number): value is MealCutoff=>{
  if(typeof value!=='object'||value===null)return false;
  const item=value as Record<string,unknown>;
  return item.meal===meals[index] && typeof item.endMinutes==='number' && Number.isInteger(item.endMinutes) && item.endMinutes>=0 && item.endMinutes<1440;
 }))throw new Error('Invalid automatic meal schedule');
 const selected=defaultMeal(new Date(),raw);
 render(selected);
 history.replaceState({},'',`/${direction}/${selected}/${location.search}`);
}else render(currentMeal());

// Keep anchor targets clear as the responsive sticky toolbar changes height.
if(direction==='hybrid' && typeof ResizeObserver!=='undefined'){
 const nav=document.querySelector<HTMLElement>('.meal-nav');
 const toolbar=document.querySelector<HTMLElement>('.meal-toolbar');
 const updateOffset=()=>{
  const box=toolbar && getComputedStyle(toolbar).display!=='contents'?toolbar:nav;
  if(box)document.body.style.setProperty('--sticky-offset',`${Math.ceil(box.getBoundingClientRect().height)+16}px`);
 };
 const observer=new ResizeObserver(updateOffset);
 if(nav)observer.observe(nav);
 if(toolbar)observer.observe(toolbar);
 updateOffset();
}
