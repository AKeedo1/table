const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../catalog.js');
const recipes = require('../recipes.json').recipes;

test('search combines dish, ingredient and cuisine words with filters', () => {
  const found = catalog.filter(recipes, {query:'salmon', cuisine:'Japanese', category:'Fish'});
  assert.deepEqual(found.map(r=>r.id), ['win-teriyaki','win-miso']);
  assert.equal(catalog.filter(recipes,{query:'salmon',category:'Beef'}).length,0);
  assert.equal(catalog.filter(recipes,{query:'not-a-real-dish-xyz'}).length,0);
});

test('search understands accents and Tagalog ingredients without archive labels', () => {
  const recipe={id:'a',title:'Crème chicken',category:'Chicken',cuisine:'French',collection:'Week 9',ingredients:['2 lemons'],tl:{ingredients:['2 limon']}};
  assert.equal(catalog.matches(recipe,'creme limon'),true);
  assert.equal(catalog.matches(recipe,'week 9'),false);
  assert.equal(catalog.matches(recipe,'lemon French'),true);
});

test('Saved combines bookmarks with the same discovery filters', () => {
  assert.deepEqual(catalog.filter(recipes,{saved:true,query:'salmon'},['win-miso','week9-sun']).map(r=>r.id),['win-miso']);
  assert.equal(catalog.filter(recipes,{saved:true},[]).length,0);
});

test('shopping contains only selected recipes and preserves repeated quantities', () => {
  const data=[{id:'a',title:'First',ingredients:['1 tsp salt','200g chicken']},{id:'b',title:'Second',ingredients:['1 tsp salt','100g salmon']},{id:'c',title:'Third',ingredients:['1 lemon']}];
  assert.deepEqual(catalog.shopping(data,[]),[]);
  const rows=catalog.shopping(data,['a','b','missing','a']);
  assert.equal(rows.length,4);
  assert.equal(rows.filter(r=>r.text==='1 tsp salt').length,2);
  assert.equal(new Set(rows.map(r=>r.key)).size,4);
  assert.equal(rows.some(r=>r.recipeId==='c'),false);
});

test('shopping language switches retain item keys and aisle grouping', () => {
  const en=catalog.shopping(recipes,['win-teriyaki','win-miso']);
  const tl=catalog.shopping(recipes,['win-teriyaki','win-miso'],'tl');
  assert.deepEqual(tl.map(r=>[r.key,r.aisle]),en.map(r=>[r.key,r.aisle]));
  assert.notEqual(tl[0].text,en[0].text);
  assert.equal(en.some(r=>/^(Pat completely dry|Split in half)/.test(r.text)),false);
  assert.equal(en.find(r=>r.text==='12 g low-sodium soy sauce').aisle,'pantry');
  assert.equal(en.find(r=>r.text.startsWith('200 g salmon')).aisle,'protein');
  assert.equal(catalog.shopping([{id:'a',ingredients:['10 g lemon juice for grain and lamb finish']}],['a'])[0].aisle,'produce');
  assert.equal(catalog.shopping([{id:'a',ingredients:['5 g garlic, grated, for beef']}],['a'])[0].aisle,'produce');
});

test('preparation notes stay in recipes, with fallback for missing translations', () => {
  assert.equal(catalog.shopping([{id:'note-test',ingredients:['Pat completely dry before cubing','200 g salmon']}],['note-test']).length,1);
  const data=[{id:'a',title:'First',ingredients:[{group:'Main',items:['2 eggs','1 tomato']}]}];
  assert.deepEqual(catalog.shopping(data,['a'],'tl'),catalog.shopping(data,['a'],'en'));
});

test('recipe upgrades reset stale ticks once while retaining favourites, notes and selections',()=>{
  const state={checks:{'win-miso':{'s:win-miso:0':1},other:{keep:1}},shop:{'recipe:win-miso:0:0':1,'recipe:other:0:0':1},savedRecipes:['win-miso'],shoppingRecipes:['win-miso'],fb:{'win-miso':{note:'Favourite'}},reviews:{'win-miso':{note:'More sauce'}}};
  const keep=JSON.stringify([state.savedRecipes,state.shoppingRecipes,state.fb,state.reviews]);
  catalog.reconcileChecks(state,[{id:'win-miso',checkRevision:'new'}]);
  assert.equal(state.checks['win-miso'],undefined);assert.deepEqual(state.checks.other,{keep:1});
  assert.equal(state.shop['recipe:win-miso:0:0'],undefined);assert.equal(state.shop['recipe:other:0:0'],1);
  assert.equal(JSON.stringify([state.savedRecipes,state.shoppingRecipes,state.fb,state.reviews]),keep);
  state.checks['win-miso']={newStep:1};catalog.reconcileChecks(state,[{id:'win-miso',checkRevision:'new'}]);
  assert.deepEqual(state.checks['win-miso'],{newStep:1});
});
