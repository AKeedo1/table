const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const legacy=require('../recipes.json').recipes;
const trials=require('../dinner-trials.json').recipes;
const catalog=require('../catalog.js');
test('trial merges without changing legacy IDs and works in search and shopping',()=>{
  const all=[...trials,...legacy];assert.equal(new Set(all.map(r=>r.id)).size,all.length);
  assert.equal(legacy.length,16);
  assert.equal(catalog.filter(all,{query:'halal chicken'}).length,1);
  const en=catalog.shopping(all,['halal-cart-chicken'],'en');
  const tl=catalog.shopping(all,['halal-cart-chicken'],'tl');
  assert.deepEqual(en.map(x=>x.key),tl.map(x=>x.key));
  assert.ok(en.some(x=>x.text.includes('120 g plain 2% Greek yogurt')));
  assert.ok(en.some(x=>x.text.includes('60 g cooked chickpeas')));
});
test('every visual stage and language retains matching check keys and available offline assets',()=>{
  const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  for(const r of trials){
    assert.equal(r.steps.length,r.visual.steps.length);assert.equal(r.tl.steps.length,r.steps.length);
    assert.equal(r.visual.tl.steps.length,r.steps.length);
    assert.deepEqual(r.ingredients.map(x=>x.items.length),r.tl.ingredients.map(x=>x.items.length));
    for(const p of [r.visual.hero,...r.visual.steps.map(s=>s.photo).filter(Boolean)]){
      assert.ok(fs.statSync(path.join(root,p.src)).size>1000,p.src);assert.ok(sw.includes(p.src));assert.ok(p.alt&&p.caption);
    }
    assert.ok(r.steps.some(s=>s.includes('74°C')));
    assert.ok(r.ingredients.flatMap(x=>x.items).some(x=>x.includes('salt TOTAL')));
  }
});
test('nutrition calculation covers the full dinner and displayed rounding agrees',()=>{
  const r=trials[0],calc=r.visual.nutritionCalculation;
  const sum=[0,0,0,0,0];for(const [,g,values] of calc.rows)values.forEach((n,i)=>sum[i]+=g*n/100);
  sum.forEach((n,i)=>assert.ok(Math.abs(n-calc.totals[i])<.001));
  assert.equal(Math.round(sum[0]/10)*10,Number(r.visual.nutrients[0].value.replace('≈','')));
  assert.equal(Math.round(sum[1]),parseInt(r.visual.nutrients[1].value));
  assert.equal(Math.round(sum[2]),parseInt(r.visual.nutrients[2].value));
  assert.equal(Math.round(sum[4]),parseInt(r.visual.nutrients[3].value));
  assert.ok(calc.rows.some(x=>x[0].includes('yogurt')&&x[1]===120));
  assert.ok(calc.rows.some(x=>x[0]==='Olive oil'&&x[1]===7));
});
