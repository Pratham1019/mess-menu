import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.PROTOTYPE_URL||'http://localhost:4322';
const output=new URL('../hybrid/screenshots/',import.meta.url);await fs.mkdir(output,{recursive:true});
const fixture=JSON.parse(await fs.readFile(new URL('../src/data/menu-snapshot.json',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:375,height:812},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'});
const page=await context.newPage();const errors=[];const external=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
const snapshots=[];const flows=[];
const meals=['breakfast','lunch','snacks','dinner'];
const eligible=m=>m==='breakfast'||m==='snacks'?['fc1','fc2']:['fc1','fc2','sindhi'];
async function go(url){await page.goto(base+url);await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>window.scrollTo(0,0));}
async function shot(name,fullPage=true){await page.screenshot({path:new URL(name,output).pathname,fullPage,animations:'disabled'});}
for(const direction of ['hybrid']){
 for(const width of [320,375,430]){
  await page.setViewportSize({width,height:812});
  for(const meal of meals){
   await go(`/${direction}/${meal}/`);
   const panel=page.locator('.meal-panel:visible');
   assert.deepEqual(await panel.locator('.mess').evaluateAll(es=>es.map(e=>e.dataset.mess)),eligible(meal));
   const tabs=await page.locator('.meal').evaluateAll(es=>es.map(e=>({text:e.textContent,rect:{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height},scrollWidth:e.scrollWidth,clientWidth:e.clientWidth})));
   for(const r of await panel.locator('.jump a,.source-meta a').evaluateAll(es=>es.map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})))){assert(r.width>=44);assert(r.height>=44);}
   assert.equal(tabs.length,4);for(const tab of tabs){assert(tab.rect.height>=44);assert(tab.rect.width>=44);assert(tab.rect.x>=0&&tab.rect.x+tab.rect.width<=width+1);assert(tab.scrollWidth<=tab.clientWidth+1);}
   for(const mess of eligible(meal)){
    const list=panel.locator(`[data-mess="${mess}"] .dish`);
    assert.deepEqual(await list.evaluateAll(es=>es.map(e=>e.dataset.original)),fixture[mess].meals[meal].items);
   }
   assert(await panel.locator('.dish').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();return Math.abs(r.x-p.x)<1&&Math.abs(r.width-p.width)<1&&getComputedStyle(e).display==='block'&&getComputedStyle(e,'::after').content==='none';})));
   const metrics=await page.evaluate(()=>{const panel=document.querySelector('.meal-panel:not([hidden])');const items=[...panel.querySelectorAll('.dish')];return {height:document.documentElement.scrollHeight,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,firstDishTop:items[0].getBoundingClientRect().top,visibleDishes:items.filter(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}).length,fontLoaded:document.fonts.check('16px '+(document.body.classList.contains('modern')?'Geist':'Plex')),nestedScroll:[...document.querySelectorAll('body *')].filter(e=>e.clientHeight>0&&e.scrollHeight>e.clientHeight+1&&['auto','scroll'].includes(getComputedStyle(e).overflowY)).length};});
   assert(!metrics.overflow);assert(metrics.fontLoaded);assert.equal(metrics.nestedScroll,0);snapshots.push({direction,width,meal,...metrics});
   if(width===375){await shot(`${direction}-${meal}-full-375.png`);if(meal==='lunch')await shot(`${direction}-lunch-viewport-375.png`,false);}
   if(meal==='lunch'&&width!==375)await shot(`${direction}-lunch-full-${width}.png`);
   // Native links remain valid across every meal even though JS handles selection.
   assert.equal(await page.locator('.meal[aria-selected="true"]').textContent(),meal.charAt(0).toUpperCase()+meal.slice(1));
  }
  // Text enlargement must preserve complete names and expose all options without clipping.
  await go(`/${direction}/breakfast/`);
  await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize),parseFloat(getComputedStyle(e).lineHeight)]);for(const [e,size,line] of sizes){e.style.fontSize=`${size*2}px`;if(Number.isFinite(line))e.style.lineHeight=`${line*2}px`;}});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert(await page.locator('.meal-panel:visible .dish').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1)));
  flows.push(`${direction} ${width}px: all four meals, eligibility, exact source entries, selector targets, overflow and 200% text reflow`);
 }
 await page.setViewportSize({width:375,height:812});await go(`/${direction}/lunch/`);
 await page.locator('.meal-panel:visible [data-jump="sindhi"]').click();
 assert(await page.evaluate(()=>window.scrollY>0));
 assert(await page.locator('.meal-nav').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<1));
 await page.locator('.meal[data-meal="breakfast"]').click();assert.equal(await page.evaluate(()=>scrollY),0);assert.equal(await page.locator('.meal-panel:visible [data-mess="sindhi"]').count(),0);
 await page.locator('.meal[data-meal="breakfast"]').press('End');assert.equal(await page.locator('.meal[aria-selected="true"]').getAttribute('data-meal'),'dinner');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-meal')),'dinner');
 await page.goBack();assert.equal(await page.locator('.meal[aria-selected="true"]').getAttribute('data-meal'),'breakfast');
 await go(`/${direction}/lunch/?scenario=mixed`);assert(await page.locator('.meal-panel:visible [data-mess="fc1"] [data-state="cached"]').isVisible());assert(await page.locator('.meal-panel:visible [data-mess="fc2"] [data-state="missing"]').isVisible());assert(await page.locator('.meal-panel:visible [data-mess="sindhi"] .food').isVisible());await shot(`${direction}-mixed-full-375.png`);
 await page.locator('.meal[data-meal="snacks"]').click();assert.equal(await page.locator('.meal-panel:visible .mess').count(),2);assert(await page.locator('.meal-panel:visible [data-mess="fc2"] [data-state="missing"]').isVisible());assert(page.url().includes('scenario=mixed'));
 for(const meal of meals){await go(`/${direction}/${meal}/`);await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.textContent),'Skip to menus');await page.keyboard.press('Enter');const pos=await page.evaluate(()=>({main:document.querySelector('main').getBoundingClientRect().top,nav:document.querySelector('.meal-nav').getBoundingClientRect().bottom}));assert(pos.main>=pos.nav-1);}
 flows.push(`${direction}: sticky selector, jump, reset, keyboard End, browser Back, independent mixed states, unsupported meals omitted and keyboard skip on all meals`);
}
// Entry uses IST even though this browser's default time zone is UTC.
await page.clock.install({time:new Date('2026-10-22T03:59:00Z')});
for(const [iso,meal] of [
 ['2026-10-22T03:59:00Z','breakfast'],['2026-10-22T04:00:00Z','lunch'],
 ['2026-10-22T08:44:00Z','lunch'],['2026-10-22T08:45:00Z','snacks'],
 ['2026-10-22T12:29:00Z','snacks'],['2026-10-22T12:30:00Z','dinner'],
 ['2026-10-22T15:59:00Z','dinner'],['2026-10-22T16:00:00Z','breakfast'],
 ['2026-10-22T18:40:00Z','breakfast']]){
 await page.clock.setFixedTime(new Date(iso));await go('/hybrid/');
 assert.equal(await page.locator('.meal[aria-selected="true"]').getAttribute('data-meal'),meal);
 assert(page.url().endsWith(`/hybrid/${meal}/`));
}
await page.locator('.meal[data-meal="dinner"]').click();await page.reload();
assert.equal(await page.locator('.meal[aria-selected="true"]').getAttribute('data-meal'),'dinner');
flows.push('Hybrid automatic IST entry: nine boundary/overnight cases, manual override preserved on reload');
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:812}});const np=await nojs.newPage();for(const d of ['hybrid']){await np.goto(`${base}/${d}/lunch/`);await np.locator('.meal[data-meal="snacks"]').click();assert.equal(await np.locator('.meal-panel:visible .mess').count(),2);}await nojs.close();
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await fs.writeFile(new URL('verification.json',output),JSON.stringify({browser:browser.version(),viewportHeight:812,dpr:2,snapshots,flows,errors,external},null,2)+'\n');console.log(JSON.stringify({snapshots:snapshots.length,flows,errors,external},null,2));await browser.close();
