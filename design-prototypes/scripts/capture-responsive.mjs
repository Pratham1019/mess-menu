import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.PROTOTYPE_URL||'http://localhost:4322';
const output=new URL('../hybrid/responsive/screenshots/',import.meta.url);await fs.mkdir(output,{recursive:true});
const fixture=JSON.parse(await fs.readFile(new URL('../src/data/menu-snapshot.json',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true});
const meals=['breakfast','lunch','snacks','dinner'];
const eligible=m=>m==='breakfast'||m==='snacks'?['fc1','fc2']:['fc1','fc2','sindhi'];
const snapshots=[],flows=[],errors=[],external=[];
for(const width of [320,375,430,599,600,768,1023,1024,1440]){
 const height=width<600?812:900;
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:width<600?2:1,isMobile:width<600,hasTouch:width<600,...(width<600?{userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'}:{})});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
 const go=async url=>{await page.goto(base+url);await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>scrollTo(0,0));};
 const shot=async(name,fullPage=true)=>page.screenshot({path:new URL(name,output).pathname,fullPage,animations:'disabled'});
 for(const meal of meals){
  await go(`/hybrid/${meal}/`);const panel=page.locator('.meal-panel:visible');
  assert.deepEqual(await panel.locator('.mess').evaluateAll(es=>es.map(e=>e.dataset.mess)),eligible(meal));
  for(const mess of eligible(meal)){
   assert.deepEqual(await panel.locator(`[data-mess="${mess}"] .dish`).evaluateAll(es=>es.map(e=>e.dataset.original)),fixture[mess].meals[meal].items);
   assert.deepEqual(await panel.locator(`[data-mess="${mess}"] .category`).allTextContents(),fixture[mess].meals[meal].sections.map(s=>s.title));
  }
  assert(await panel.locator('.dish').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();return Math.abs(r.x-p.x)<1&&Math.abs(r.width-p.width)<1&&getComputedStyle(e).display==='block';})));
  for(const r of await page.locator('.meal,.meal-panel:visible .jump a:visible,.meal-panel:visible .source-meta a').evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})))){assert(r.w>=44);assert(r.h>=44);}
  const state=await page.evaluate(()=>{const panel=document.querySelector('.meal-panel:not([hidden])'),items=[...panel.querySelectorAll('.dish')];return {width:innerWidth,viewportHeight:innerHeight,height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,firstDishTop:items[0].getBoundingClientRect().top,firstScreenDishes:items.filter(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}).length,messes:[...panel.querySelectorAll('.mess')].map(e=>{const r=e.getBoundingClientRect();return {id:e.dataset.mess,x:r.x,y:r.y,w:r.width,h:r.height};}),columns:getComputedStyle(panel.querySelector('.menu-stack')).gridTemplateColumns,controlsWidth:document.querySelector('.meal-options').getBoundingClientRect().width,fonts:document.fonts.check('16px Plex')&&document.fonts.check('30px Fraunces'),nestedScroll:[...panel.querySelectorAll('*')].some(e=>e.clientHeight>0&&e.scrollHeight>e.clientHeight+1&&['auto','scroll'].includes(getComputedStyle(e).overflowY))};});
  assert(!state.overflow);assert(state.fonts);assert(!state.nestedScroll);
  if(width<600){assert(state.messes.every(m=>Math.abs(m.x-state.messes[0].x)<1));for(let i=1;i<state.messes.length;i++)assert(state.messes[i].y>=state.messes[i-1].y+state.messes[i-1].h-1);}
  else if(width<1024){assert(Math.abs(state.messes[0].y-state.messes[1].y)<1);assert(state.messes[1].x>state.messes[0].x);if(state.messes[2])assert(state.messes[2].y>=state.messes[0].y+state.messes[0].h-1);}
  else {assert(state.messes.every(m=>Math.abs(m.y-state.messes[0].y)<1));assert(state.messes.every(m=>m.w>=280));assert(state.controlsWidth<=440);}
  snapshots.push({meal,...state});
  if([375,1440].includes(width)){await shot(`hybrid-${meal}-full-${width}.png`);if(meal==='lunch')await shot(`hybrid-lunch-viewport-${width}.png`,false);}
  if(meal==='lunch'&&[320,430,768].includes(width))await shot(`hybrid-lunch-full-${width}.png`);
 }
 await go('/hybrid/breakfast/');
 await page.evaluate(()=>{const values=[...document.querySelectorAll('body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize),parseFloat(getComputedStyle(e).lineHeight)]);for(const[e,size,line]of values){e.style.fontSize=`${size*2}px`;if(Number.isFinite(line))e.style.lineHeight=`${line*2}px`;}});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 flows.push(`${width}px: four meals, full names/groups/order, layout topology, 44px targets, overflow and 200% text stress`);
 if([375,1440].includes(width)){
  await go('/hybrid/lunch/?scenario=mixed');assert(await page.locator('.meal-panel:visible [data-mess="fc1"] [data-state="cached"]').isVisible());assert(await page.locator('.meal-panel:visible [data-mess="fc2"] [data-state="missing"]').isVisible());assert(await page.locator('.meal-panel:visible [data-mess="sindhi"] .food').isVisible());await shot(`hybrid-mixed-full-${width}.png`);
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.locator('.meal[data-meal="breakfast"]').click();assert.equal(await page.evaluate(()=>scrollY),0);assert.equal(await page.locator('.meal-panel:visible .mess').count(),2);
  await page.locator('.meal.selected').press('End');assert.equal(await page.locator('.meal.selected').getAttribute('data-meal'),'dinner');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-meal')),'dinner');await page.goBack();assert.equal(await page.locator('.meal.selected').getAttribute('data-meal'),'breakfast');
  await go('/hybrid/lunch/');await page.keyboard.press('Tab');await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.querySelector('main').getBoundingClientRect().top>=document.querySelector('.meal-nav').getBoundingClientRect().bottom-1));
  flows.push(`${width}px: mixed failures, eligible source count, reset, keyboard End/focus, Back, skip landing`);
 }
 if(width===375){
  await page.clock.install({time:new Date('2026-10-22T03:59:00Z')});for(const[time,meal]of[['03:59','breakfast'],['04:00','lunch'],['08:44','lunch'],['08:45','snacks'],['12:29','snacks'],['12:30','dinner'],['15:59','dinner'],['16:00','breakfast'],['18:40','breakfast']]){await page.clock.setFixedTime(new Date(`2026-10-22T${time}:00Z`));await go('/hybrid/');assert.equal(await page.locator('.meal.selected').getAttribute('data-meal'),meal);}
  flows.push('Automatic IST entry: nine cutoff/overnight cases');
 }
 await context.close();
}
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:812}}),np=await nojs.newPage();await np.goto(base+'/hybrid/lunch/');await np.locator('.meal[data-meal="snacks"]').click();assert.equal(await np.locator('.meal-panel:visible .mess').count(),2);await nojs.close();
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
await fs.writeFile(new URL('verification.json',output),JSON.stringify({browser:browser.version(),snapshots,flows,errors,external},null,2)+'\n');console.log(JSON.stringify({states:snapshots.length,flows,errors,external},null,2));await browser.close();
