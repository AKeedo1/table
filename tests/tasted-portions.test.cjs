const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const trials=require('../dinner-trials.json').recipes;
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
test('recipe app excludes chat-only goal scores',()=>{
 for(const file of ['index.html','sw.js','navigation.js','visual-recipes.js','table.js']){
  const source=fs.readFileSync(path.join(root,file),'utf8');
  assert.ok(!/goal-review|goalBadge|goalDetail|GOAL_REVIEW/.test(source),file);
 }
 assert.ok(!fs.existsSync(path.join(root,'goal-review-data.js')));
 assert.ok(!fs.existsSync(path.join(root,'goal-review.js')));
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
