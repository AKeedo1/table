const test=require('node:test');
const assert=require('node:assert/strict');
const review=require('../recipe-review.js');
const recipes=[{id:'first',title:'First dish'},{id:'second',title:'Second dish'},{id:'third',title:'Third dish'}];
test('undecided recipes are never inferred as keep or remove; unrelated IDs are ignored',()=>{
  const state={first:{choice:'keep'},second:{choice:'remove'},third:{choice:'other'},stale:{choice:'keep'}};
  assert.deepEqual(review.counts(recipes,state),{keep:1,remove:1,undecided:1});
  assert.deepEqual(review.counts(recipes,{}),{keep:0,remove:0,undecided:3});
});
test('share text preserves stable identities, user notes and undecided choices without mutating data',()=>{
  const state={first:{choice:'keep',note:'More sauce'},second:{choice:'remove'},third:{note:'Maybe another side'}};
  const before=JSON.stringify({recipes,state});const text=review.summary(recipes,state);
  assert.ok(text.includes('KEEP & UPDATE: First dish [first]\nChanges: More sauce'));
  assert.ok(text.includes('REMOVE: Second dish [second]'));
  assert.ok(text.includes('UNDECIDED: Third dish [third]\nChanges: Maybe another side'));
  assert.equal(JSON.stringify({recipes,state}),before);
});
