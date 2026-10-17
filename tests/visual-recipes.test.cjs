const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const legacy=require('../recipes.json').recipes;
const trials=require('../dinner-trials.json').recipes;
const catalog=require('../catalog.js');
const vm=require('node:vm');
test('trial merges without changing legacy IDs and works in search and shopping',()=>{
  const all=[...trials,...legacy];assert.equal(new Set(all.map(r=>r.id)).size,all.length);
  assert.equal(legacy.length,16);
  assert.ok(catalog.filter(all,{query:'halal chicken'}).some(r=>r.id==='halal-cart-chicken'));
  assert.equal(trials.length,6);
  assert.deepEqual(trials.filter(r=>r.approved).map(r=>r.id),['halal-cart-chicken']);
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
    assert.ok(r.steps.some(s=>s.includes(r.category==='Beef'?'71°C':'74°C')));
    assert.deepEqual(r.visual.steps.map(s=>s.bullets.length),r.visual.tl.steps.map(s=>s.bullets.length));
    assert.ok(r.visual.time && r.visual.number);
    assert.ok(r.ingredients.flatMap(x=>x.items).some(x=>x.includes('salt TOTAL')));
  }
});
test('nutrition calculation covers the full dinner and displayed rounding agrees',()=>{
  for(const r of trials){const calc=r.visual.nutritionCalculation;
  const sum=[0,0,0,0,0];for(const [,g,values] of calc.rows)values.forEach((n,i)=>sum[i]+=g*n/100);
  sum.forEach((n,i)=>assert.ok(Math.abs(n-calc.totals[i])<.001));
  assert.equal(Math.round(sum[0]/10)*10,Number(r.visual.nutrients[0].value.replace('≈','')));
  assert.equal(Math.round(sum[1]),parseInt(r.visual.nutrients[1].value));
  assert.equal(Math.round(sum[2]),parseInt(r.visual.nutrients[2].value));
  assert.equal(Math.round(sum[4]),parseInt(r.visual.nutrients[3].value));
  }
  const approved=trials[0].visual.nutritionCalculation;
  assert.ok(approved.rows.some(x=>x[0].includes('yogurt')&&x[1]===120));
  assert.ok(approved.rows.some(x=>x[0]==='Olive oil'&&x[1]===7));
});
test('six dinners have matching translated shopping rows and complete visual guides',()=>{
  const ids=trials.map(r=>r.id);
  const en=catalog.shopping(trials,ids,'en'),tl=catalog.shopping(trials,ids,'tl');
  assert.deepEqual(en.map(x=>x.key),tl.map(x=>x.key));
  assert.equal(new Set(en.map(x=>x.recipeId)).size,6);
  for(const r of trials){
    const photos=new Set([r.visual.hero.src,...r.visual.steps.filter(s=>s.photo).map(s=>s.photo.src)]);
    assert.equal(photos.size,3,r.id);
    assert.deepEqual(r.visual.steps.filter(s=>s.photo).map(s=>s.photo.src),r.visual.tl.steps.filter(s=>s.photo).map(s=>s.photo.src));
  }
});
test('offline requests retain the correct legacy and visual recipe catalogs',async()=>{
  const handlers={};
  const cache=new Map([
    ['/table/recipes.json',{recipes:legacy}],
    ['/table/dinner-trials.json',{recipes:trials}]
  ]);
  vm.runInNewContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),{
    URL,Promise,
    self:{location:{origin:'https://example.test',href:'https://example.test/table/sw.js'},addEventListener:(name,fn)=>handlers[name]=fn},
    fetch:async()=>{throw new Error('offline');},
    caches:{match:async(key,options)=>{
      if(options!==undefined)assert.equal(typeof options,'object');
      return cache.get(key);
    }}
  });
  for(const [filename,count] of [['recipes.json',16],['dinner-trials.json',6]]){
    let response;
    handlers.fetch({request:{method:'GET',url:'https://example.test/table/'+filename+'?v=offline-test'},respondWith:p=>response=p});
    assert.equal((await response).recipes.length,count);
  }
});
