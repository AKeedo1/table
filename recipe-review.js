'use strict';
// Decisions stay separate from favourites and cooked ratings. No recipe is silently deleted.
const TableReview = {
  choice(state,id){const value=state?.[id]?.choice;return ['keep','remove'].includes(value)?value:'';},
  counts(recipes,state){const counts={keep:0,remove:0,undecided:0};for(const r of recipes)counts[this.choice(state,r.id)||'undecided']++;return counts;},
  summary(recipes,state){return 'Table — old recipe review\nKeep = update to the new recipe, instructions and photo format.\n\n'+recipes.map(r=>{
    const choice=this.choice(state,r.id),note=state?.[r.id]?.note||'';
    return `${choice==='keep'?'KEEP & UPDATE':choice==='remove'?'REMOVE':'UNDECIDED'}: ${r.title} [${r.id}]${note?'\nChanges: '+note:''}`;
  }).join('\n\n');}
};
if(typeof module!=='undefined')module.exports=TableReview;

function oldRecipes(){return DATA.filter(r=>!r.visual);}
const OLD_RECIPE_NOTES={
  'week9-sun':['Charred chicken, jasmine rice, crunchy herb slaw and lime sauce.','Charred na manok, jasmine rice, malutong na herb slaw at lime sauce.'],
  'week9-mon':['Garlic-yogurt chicken, spinach, almonds, pomegranate and flatbread.','Garlic-yogurt na manok, spinach, almonds, pomegranate at flatbread.'],
  'week9-tue':['Harissa salmon, blistered courgette, tomatoes and lemon rice.','Harissa salmon, browned courgette, kamatis at lemon rice.'],
  'week9-wed':['Grilled inasal chicken, garlic rice, smoky eggplant and carrot pickle.','Inasal na manok, garlic rice, smoky na talong at carrot pickle.'],
  'week9-thu':['Black-pepper chicken, broccoli and beans, rice and smashed cucumber.','Black-pepper na manok, broccoli at beans, kanin at smashed cucumber.'],
  'win-krapao':['Chilli-garlic holy basil chicken, jasmine rice and a crisp fried egg.','Chilli-garlic holy basil na manok, jasmine rice at crispy fried egg.'],
  'win-bulgogi':['Sweet-savoury chicken, lettuce wraps, rice and pickled cucumber.','Matamis-alat na manok, lettuce wraps, kanin at pickled cucumber.'],
  'win-braised':['Tender chicken thighs, preserved lemon, olives and herbed bulgur.','Malambot na chicken thighs, preserved lemon, olives at herbed bulgur.'],
  'win-sichuan':['Sichuan chilli chicken, blistered green beans and jasmine rice.','Sichuan chilli na manok, blistered green beans at jasmine rice.'],
  'win-aji':['Ají de gallina: chicken in creamy yellow-chilli sauce, rice and fresh onion salsa.','Ají de gallina: manok sa creamy yellow-chilli sauce, kanin at sariwang onion salsa.'],
  'win-souvlaki':['Lamb souvlaki, lemon freekeh, finely diced Greek salad and tzatziki.','Lamb souvlaki, lemon freekeh, pinong Greek salad at tzatziki.'],
  'win-bibimbap':['Beef bibimbap, rice, seasoned vegetables, gochujang sauce and fried egg.','Beef bibimbap, kanin, tinimplahang gulay, gochujang sauce at fried egg.'],
  'win-poke':['Cooked salmon poke, sushi-style rice, edamame, avocado and pickled cucumber.','Lutong salmon poke, sushi-style rice, edamame, avocado at pickled cucumber.'],
  'win-teriyaki':['Glazed salmon cubes, rice, garlicky greens and pickled ginger.','Glazed salmon cubes, kanin, garlicky greens at pickled ginger.'],
  'win-miso':['Miso-glazed salmon, seared broccolini and sesame cucumber salad.','Miso-glazed salmon, seared broccolini at sesame cucumber salad.'],
  'win-chermoula':['Herb-and-lemon hammour, roasted cauliflower and herbed freekeh.','Hammour na may herbs at lemon, roasted cauliflower at herbed freekeh.']
};
function renderRecipeReview(){
  wantWake=false;releaseWake();
  const recipes=oldRecipes();store.recipeDecisions=store.recipeDecisions||{};
  if(!recipes.length){
    app.innerHTML=header()+`<main class="recipe-browser recipe-review-page"><div class="browse-heading"><p class="eyebrow">${vtxt('Recipe review','Review ng recipe')}</p><h1>${vtxt('Your menu is updated.','Na-update na ang menu mo.')}</h1><p>${vtxt('The ten keepers now have updated recipes, short instructions and photo guides. The six removals are off the menu.','May updated na recipe, maiikling hakbang at mga larawan ang sampung itinira. Wala na sa menu ang anim na inalis.')}</p><a class="primary-action" href="#/recipes">${vtxt('See the recipes','Tingnan ang mga recipe')} →</a></div></main>${bottomNav('recipes')}`;
    bindLang(app);return;
  }
  app.innerHTML=header()+`<main class="recipe-browser recipe-review-page"><a class="text-action" href="#/recipes">← ${nt('recipes')}</a><div class="browse-heading"><p class="eyebrow">${vtxt('The older recipes','Mga lumang recipe')} / ${recipes.length}</p><h1>${vtxt('What stays on the menu?','Alin ang mananatili?')}</h1><p>${vtxt('Keep the dishes you want. We’ll update their recipes, instructions and photos.','Piliin ang mga gustong itira. Ia-update natin ang recipe, mga hakbang at larawan.')}</p></div><p class="review-count" aria-live="polite"></p><div class="recipe-decisions">${recipes.map((r,i)=>{
    const c=content(r),decision=TableReview.choice(store.recipeDecisions,r.id),note=store.recipeDecisions[r.id]?.note||'';
    return `<article class="recipe-decision" data-decision-id="${esc(r.id)}"><div class="decision-heading"><span>${String(i+1).padStart(2,'0')}</span><div><p class="eyebrow">${esc(r.cuisine)} · ${esc(r.category)}</p><h2><a class="review-recipe-link" href="#/r/${esc(r.id)}">${esc(r.title)}</a></h2></div></div><p class="decision-description">${esc(OLD_RECIPE_NOTES[r.id]?.[store.lang==='tl'?1:0]||r.subtitle||'')}</p><a class="text-action review-recipe-link" href="#/r/${esc(r.id)}">${vtxt('See current recipe','Tingnan ang kasalukuyang recipe')} →</a><div class="decision-buttons" role="group" aria-label="${vtxt('Decision for','Pasya para sa')} ${esc(r.title)}">${[['keep','Keep & update','Itira at i-update'],['remove','Remove','Alisin']].map(([key,en,tl])=>`<button data-decision="${key}" aria-pressed="${decision===key}">${vtxt(en,tl)}</button>`).join('')}<button class="decision-undo" data-undo ${decision?'':'hidden'}>${vtxt('Undo','Bawiin')}</button></div><details class="decision-notes" ${note?'open':''}><summary>${vtxt('Anything to change?','May gustong baguhin?')}</summary><label class="sr-only" for="note-${esc(r.id)}">${vtxt('Changes for','Mga pagbabago sa')} ${esc(r.title)}</label><textarea id="note-${esc(r.id)}" rows="2" placeholder="${vtxt('Sauce, sides, ingredients…','Sarsa, side dish, sangkap…')}">${esc(note)}</textarea></details></article>`;
  }).join('')}</div><section class="review-share"><h2>${vtxt('Ready to share?','Handa nang ibahagi?')}</h2><p>${vtxt('Choices stay on this device. Copy them into our chat to apply removals and update the keepers.','Nasa device na ito ang mga pinili. Kopyahin sa chat para maalis ang ayaw at ma-update ang mga ititira.')}</p><button class="primary-action" id="copyDecisions">${vtxt('Copy my choices','Kopyahin ang mga pinili')}</button><p id="decisionStatus" role="status" aria-live="polite"></p><details><summary>${vtxt('View my choices','Tingnan ang mga pinili')}</summary><label class="sr-only" for="decisionExport">${vtxt('Review to copy','Review na kokopyahin')}</label><textarea id="decisionExport" readonly rows="12"></textarea></details></section></main>${bottomNav('recipes')}`;
  const refresh=()=>{
    const c=TableReview.counts(recipes,store.recipeDecisions);
    app.querySelector('.review-count').textContent=vtxt(`${c.keep} keep · ${c.remove} remove · ${c.undecided} undecided`,`${c.keep} ititira · ${c.remove} aalisin · ${c.undecided} wala pang pasya`);
    app.querySelector('#decisionExport').value=TableReview.summary(recipes,store.recipeDecisions);
  };refresh();bindLang(app);
  app.querySelectorAll('[data-decision-id]').forEach(card=>{
    const id=card.dataset.decisionId;
    const update=choice=>{
      store.recipeDecisions[id]={...store.recipeDecisions[id],choice};save();
      card.querySelectorAll('[data-decision]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.decision===choice));
      card.querySelector('[data-undo]').hidden=!choice;refresh();
    };
    card.querySelectorAll('[data-decision]').forEach(b=>b.onclick=()=>update(b.dataset.decision));
    card.querySelector('[data-undo]').onclick=()=>{update('');card.querySelector('[data-decision]').focus({preventScroll:true});};
    card.querySelector('textarea').oninput=e=>{store.recipeDecisions[id]={...store.recipeDecisions[id],note:e.target.value};save();refresh();};
  });
  app.querySelectorAll('.review-recipe-link').forEach(a=>a.onclick=rememberBrowse);
  app.querySelector('#copyDecisions').onclick=async()=>{
    try{await navigator.clipboard.writeText(TableReview.summary(recipes,store.recipeDecisions));app.querySelector('#decisionStatus').textContent=vtxt('Copied. Paste into our chat.','Nakopya. I-paste sa chat.');}
    catch(e){const output=app.querySelector('#decisionExport');output.closest('details').open=true;output.focus();output.select();app.querySelector('#decisionStatus').textContent=vtxt('Select and copy the choices below.','Piliin at kopyahin ang nasa ibaba.');}
  };
  // Language switching owns its reading anchor; do not schedule a competing scroll.
  if(!changingLanguage)requestAnimationFrame(()=>window.scrollTo(0,returnRoute==='/recipe-review'?returnScroll:0));
}
