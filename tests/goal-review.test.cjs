const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const trials=require('../dinner-trials.json').recipes;
const all=[...trials,...require('../recipes.json').recipes];
const context={};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'goal-review-data.js'),'utf8')+';globalThis.review=GOAL_REVIEW;',context);
test('every dinner has a traceable score tied to the current nutrient calculation',()=>{
 assert.deepEqual(Object.keys(context.review).sort(),all.map(r=>r.id).sort());
 for(const r of all){const a=context.review[r.id];
  assert.equal(a.points.length,5);assert.ok(a.points.every(p=>Number.isInteger(p)&&p>=0&&p<=2));
  assert.equal(a.score,a.points.reduce((x,y)=>x+y,0));
  assert.deepEqual(Array.from(a.totals),r.visual.nutritionCalculation.totals,'stale assessment: '+r.id);
  assert.ok(a.good&&a.watch&&a.tl.good&&a.tl.watch&&a.status&&a.tl.status);
 }
 assert.equal(context.review['halal-cart-chicken'].points[4],1,'new flavour is untested');
 assert.equal(context.review['ajiaco-chicken'].points[3],2,'soup portion actually worked');
 assert.equal(context.review['win-krapao'].points[1],0,'low fibre must not be hidden');
});
test('smaller dinners keep rice, use full sauce accounting, and have matched translated amounts',()=>{
 const h=trials.find(r=>r.id==='halal-cart-chicken'),c=trials.find(r=>r.id==='curry-chicken');
 const qty=(r,key)=>r.visual.nutritionCalculation.rows.filter(x=>x[0]===key).reduce((s,x)=>s+x[1],0);
 assert.equal(qty(h,'Dry white rice'),35);assert.equal(qty(c,'Dry white rice'),40);
 assert.equal(qty(h,'Chicken breast raw'),150);assert.equal(qty(c,'Chicken breast raw'),150);
 assert.equal(qty(c,'Green beans'),112.5);assert.equal(qty(c,'Plain Greek yogurt 2%'),45);
 assert.equal(qty(c,'Olive oil'),6);assert.equal(qty(c,'Mixed spices estimate'),3.75);
 assert.equal(qty(h,'Chicken stock estimate'),80);assert.equal(qty(h,'Chickpeas cooked without salt'),30);
 assert.ok(h.steps.some(s=>s.includes('25–30 minutes')&&s.includes('chickpeas')));
 assert.ok(h.steps.some(s=>s.includes('sauce garlic with its salt')));
 assert.ok(!h.ingredients.flatMap(g=>g.items).some(x=>/mayonnaise|\bmayo\b/i.test(x)));
 for(const r of [h,c]){
  const en=r.ingredients.flatMap(g=>g.items),tl=r.tl.ingredients.flatMap(g=>g.items);
  en.forEach((x,i)=>assert.deepEqual(x.match(/\d+(?:\.\d+)?|[½¼¾⅛⅜]/g),tl[i].match(/\d+(?:\.\d+)?|[½¼¾⅛⅜]/g)));
  assert.equal(r.checkRevision,'tasted-portions-1');
 }
});
test('goal review scripts are loaded and precached without publishing private health records',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
 for(const file of ['goal-review.js','goal-review-data.js']){assert.ok(html.includes(file));assert.ok(sw.includes(file));}
 const published=fs.readFileSync(path.join(root,'goal-review-data.js'),'utf8')+fs.readFileSync(path.join(root,'goal-review.js'),'utf8');
 assert.ok(!/ApoB|HOMA|GI.MAP|Dana|132 kg|1,900/.test(published));
 assert.ok(published.includes('not a medical score'));assert.ok(published.includes('not a measured sodium'));
});
test('practical scant-spoon quantities scale in both languages',()=>{
 const source=fs.readFileSync(path.join(root,'table.js'),'utf8');
 const c={};vm.createContext(c);
 vm.runInContext(source.slice(source.indexOf('const FRAC='),source.indexOf('function scalerHTML'))+';globalThis.scaleLine=scaleLine;',c);
 assert.equal(c.scaleLine('scant ¼ tsp turmeric',2),'scant 0.5 tsp turmeric');
 assert.equal(c.scaleLine('kulang na ¼ tsp turmeric',3),'kulang na 0.75 tsp turmeric');
 assert.equal(c.scaleLine('10–15 ml water',2),'20–30 ml water');
 assert.equal(c.scaleLine('⅜ tsp cumin',2),'0.75 tsp cumin');
});
