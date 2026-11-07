const test=require('node:test');
const assert=require('node:assert/strict');
const all=require('../dinner-trials.json').recipes;
const ids=['chicken-stroganoff','musakhan-chicken-bowl','chicken-tortilla-soup','chicken-piccata','cod-piccata'];
test('five distinct additions retain complete translated quantities and nutrition rows',()=>{
 for(const id of ids){
  const r=all.find(r=>r.id===id);assert.ok(r,id);
  const en=r.ingredients.flatMap(g=>g.items),tl=r.tl.ingredients.flatMap(g=>g.items);
  assert.equal(en.length,tl.length);assert.equal(en.length,r.visual.nutritionCalculation.rows.length);
  en.forEach((s,i)=>assert.deepEqual(s.match(/\d+(?:\.\d+)?/g),tl[i].match(/\d+(?:\.\d+)?/g),id+': '+s));
  assert.deepEqual(r.visual.steps.map(s=>s.bullets.length),r.visual.tl.steps.map(s=>s.bullets.length));
  assert.ok(!/Dana|patient|bloodwork|weight loss/.test(JSON.stringify(r)));
  assert.ok(r.steps.some(s=>s.includes(id==='cod-piccata'?'63°C':'74°C')));
 }
});
test('piccatas keep the specified sides, and musakhan keeps separate tabbouleh',()=>{
 for(const id of ['chicken-piccata','cod-piccata']){
  const r=all.find(r=>r.id===id),text=r.steps.join(' ');
  assert.ok(text.includes('final 2 minutes'));assert.ok(text.includes('after roasting'));
  assert.ok(text.includes('out of the sauce'));assert.ok(!/green beans/i.test(JSON.stringify(r)));
  assert.ok(r.ingredients.flatMap(g=>g.items).some(s=>s.startsWith('160 g broccoli')));
 }
 const m=all.find(r=>r.id==='musakhan-chicken-bowl');
 assert.ok(m.ingredients.flatMap(g=>g.items).some(s=>s.startsWith('60 g onion')));
 assert.ok(m.steps.some(s=>s.includes('separate small bowl')));
 assert.ok(m.visual.basis.includes('wheat (bulgur)'));
});
