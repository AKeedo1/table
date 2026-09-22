'use strict';
const NAV_COPY={
 en:{recipes:'Recipes',saved:'Saved',shopping:'Shopping',heading:'What sounds good?',savedHeading:'Keep the good ones.',search:'Dish, ingredient or cuisine',searchLabel:'Search recipes',clear:'Clear search',ingredient:'Main ingredient',anyIngredient:'Any ingredient',cuisine:'Cuisine',anyCuisine:'Any cuisine',allRecipes:'The recipe box',results:'recipes',oneResult:'recipe',reset:'Clear filters',save:'Save recipe',unsave:'Unsave recipe',noResults:'No dishes found.',noResultsHelp:'Try another ingredient, cuisine or search.',noSaved:'Your favourites belong here.',noSavedHelp:'Tap the bookmark on a recipe to find it here next time.',browse:'Browse recipes',device:'Saved on this phone.',shopTitle:'Shopping list',shopIntro:'Choose your dishes. We’ll gather the ingredients.',choose:'Choose dishes',change:'Change dishes',emptyShop:'What are you cooking?',emptyShopHelp:'Pick one dish or a few. Your list will include just what you need for those recipes.',dish:'dish',dishes:'dishes',items:'items',checked:'checked',protein:'Meat & fish',produce:'Fruit, veg & herbs',pantry:'Pantry & other',from:'For',uncheck:'Uncheck all',remove:'Remove',close:'Close',use:'Use these dishes',addShopping:'Add to shopping',inShopping:'In shopping list',continue:'Continue cooking',step:'Step',of:'of',back:'Back to results',settings:'Your notes',backup:'Back up notes',restore:'Restore',shopDevice:'Your selection and ticks stay on this phone.',recipeAmounts:'Quantities are shown separately for each dish.'},
 tl:{recipes:'Mga recipe',saved:'Naka-save',shopping:'Bilihin',heading:'Anong gustong lutuin?',savedHeading:'Balikan ang mga paborito.',search:'Ulam, sangkap o lutuin',searchLabel:'Maghanap ng recipe',clear:'Burahin ang paghahanap',ingredient:'Pangunahing sangkap',anyIngredient:'Anumang sangkap',cuisine:'Lutuin',anyCuisine:'Anumang lutuin',allRecipes:'Mga recipe',results:'recipe',oneResult:'recipe',reset:'Alisin ang mga filter',save:'I-save ang recipe',unsave:'Alisin sa naka-save',noResults:'Walang nahanap na ulam.',noResultsHelp:'Subukan ang ibang sangkap, lutuin o salita.',noSaved:'Dito ang mga paborito mo.',noSavedHelp:'Pindutin ang bookmark sa recipe para madaling balikan.',browse:'Tingnan ang mga recipe',device:'Naka-save sa teleponong ito.',shopTitle:'Listahan ng bilihin',shopIntro:'Piliin ang mga lulutuin. Ililista namin ang mga sangkap.',choose:'Pumili ng mga ulam',change:'Baguhin ang mga ulam',emptyShop:'Ano ang lulutuin?',emptyShopHelp:'Pumili ng isa o ilang ulam. Ililista lamang ang mga sangkap para sa mga napili.',dish:'ulam',dishes:'ulam',items:'sangkap',checked:'nakuha na',protein:'Karne at isda',produce:'Gulay, prutas at herbs',pantry:'Pantry at iba pa',from:'Para sa',uncheck:'Alisin lahat ng tsek',remove:'Alisin',close:'Isara',use:'Gamitin ang mga napili',addShopping:'Idagdag sa bilihin',inShopping:'Nasa listahan na',continue:'Ituloy ang pagluluto',step:'Hakbang',of:'sa',back:'Bumalik sa listahan',settings:'Mga tala mo',backup:'I-back up ang mga tala',restore:'Ibalik ang mga tala',shopDevice:'Sa teleponong ito naka-save ang listahan at mga tsek.',recipeAmounts:'Hiwalay ang dami ng sangkap para sa bawat ulam.'}
};
const NAV_ICONS={
 recipes:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 18V6M7 7h9M7 11h7"/>',
 saved:'<path d="M6 3h12v18l-6-4-6 4z"/>',
 shopping:'<path d="M4 8h16l-2 13H6zM8 9V6a4 4 0 0 1 8 0v3"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'
};
function ni(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${NAV_ICONS[name]||''}</svg>`;}
function nt(key){return (NAV_COPY[store.lang]||NAV_COPY.en)[key]||key;}
function validSaved(){return (Array.isArray(store.savedRecipes)?store.savedRecipes:[]).filter(id=>DATA.some(r=>r.id===id));}
function chosenRecipes(){return (Array.isArray(store.shoppingRecipes)?store.shoppingRecipes:[]).filter(id=>DATA.some(r=>r.id===id));}
function isSaved(id){return validSaved().includes(id);}
let browseState={recipes:{query:'',category:'',cuisine:''},saved:{query:'',category:'',cuisine:''}};
let browseView='recipes', returnRoute='/recipes', returnScroll=0;
try {const previous=JSON.parse(sessionStorage.getItem('table.browse')||'null');if(previous){browseState={...browseState,...previous.states};returnRoute=previous.route||returnRoute;returnScroll=previous.scroll||0;}}catch(e){}
function catalogURL(view=browseView){const f=browseState[view];const p=new URLSearchParams();if(f.query)p.set('q',f.query);if(f.category)p.set('ingredient',f.category);if(f.cuisine)p.set('cuisine',f.cuisine);return '/'+view+(p.toString()?'?'+p:'');}
function rememberBrowse(){returnRoute=location.hash.slice(1)||'/recipes';returnScroll=window.scrollY;try{sessionStorage.setItem('table.browse',JSON.stringify({states:browseState,route:returnRoute,scroll:returnScroll}));}catch(e){}}
function syncBrowseURL(){history.replaceState(null,'','#'+catalogURL());rememberBrowse();}
function bottomNav(view){return `<nav class="table-nav" aria-label="${store.lang==='tl'?'Pangunahing menu':'Main navigation'}">${['recipes','saved','shopping'].map(name=>`<a href="#${name==='shopping'?'/shop':catalogURL(name)}" ${view===name?'aria-current="page"':''}>${ni(name)}<span>${nt(name)}</span>${name==='shopping'&&chosenRecipes().length?`<b>${chosenRecipes().length}</b>`:''}</a>`).join('')}</nav>`;}
function refreshNav(view){const navEl=app.querySelector('.table-nav');if(navEl)navEl.outerHTML=bottomNav(view);}
function saveButton(r, text=false){return `<button class="bookmark ${isSaved(r.id)?'is-saved':''} ${text?'with-label':''}" data-bookmark="${esc(r.id)}" aria-pressed="${isSaved(r.id)}" aria-label="${nt(isSaved(r.id)?'unsave':'save')}: ${esc(r.title)}">${ni('saved')}${text?`<span>${nt(isSaved(r.id)?'saved':'save')}</span>`:''}</button>`;}
function wireBookmarks(){app.querySelectorAll('[data-bookmark]').forEach(button=>button.onclick=e=>{e.stopPropagation();const id=button.dataset.bookmark;store.savedRecipes=isSaved(id)?validSaved().filter(x=>x!==id):[...validSaved(),id];save();if(app.querySelector('#deck'))drawDeck();else{const r=DATA.find(x=>x.id===id);button.outerHTML=saveButton(r,true);wireBookmarks();}});}
function renderHome(view='recipes'){
  browseView=view;wantWake=false;releaseWake();
  const q=new URLSearchParams(location.hash.split('?')[1]||'');
  browseState[view]={query:q.get('q')||'',category:q.get('ingredient')||'',cuisine:q.get('cuisine')||''};
  const f=browseState[view], pool=view==='saved'?DATA.filter(r=>isSaved(r.id)):DATA;
  const cats=[...new Set(DATA.map(r=>r.category))], cuisines=[...new Set(DATA.map(r=>r.cuisine))].sort();
  const resume=view==='recipes'&&!f.query&&!f.category&&!f.cuisine?DATA.find(r=>cookProgress(r)):null;
  app.innerHTML=header()+`<main class="recipe-browser">
    <div class="browse-heading"><p class="eyebrow">${nt(view==='saved'?'saved':'allRecipes')} <span> / ${pool.length}</span></p><h1>${nt(view==='saved'?'savedHeading':'heading')}</h1></div>
    <div class="find-bar"><label class="search-field">${ni('search')}<input id="recipeSearch" type="search" autocomplete="off" placeholder="${nt('search')}" aria-label="${nt('searchLabel')}" value="${esc(f.query)}"></label><button id="clearSearch" aria-label="${nt('clear')}" ${f.query?'':'hidden'}>×</button></div>
    <div class="browse-filters"><label><span>${nt('ingredient')}</span><select id="ingredientFilter" aria-label="${nt('ingredient')}"><option value="">${nt('anyIngredient')}</option>${cats.map(c=>`<option value="${esc(c)}" ${f.category===c?'selected':''}>${esc(c)} · ${pool.filter(r=>r.category===c).length}</option>`).join('')}</select></label><label><span>${nt('cuisine')}</span><select id="cuisineFilter" aria-label="${nt('cuisine')}"><option value="">${nt('anyCuisine')}</option>${cuisines.map(c=>`<option ${f.cuisine===c?'selected':''} value="${esc(c)}">${esc(c)}</option>`).join('')}</select></label></div>
    ${resume?`<a class="continue-cooking" href="#/cook/${esc(resume.id)}"><span>${nt('continue')} <b>→</b></span><strong>${esc(resume.title)}</strong><small>${nt('step')} ${cookProgress(resume).next} ${nt('of')} ${resume.steps.length}</small></a>`:''}
    <div class="results-line"><p id="resultCount" role="status" aria-live="polite"></p><button id="clearFilters">${nt('reset')}</button></div>
    <div class="deck" id="deck"></div>
    ${view==='saved'?`<p class="device-note">${nt('device')}</p>`:''}
    <details class="datafoot"><summary>${nt('settings')}</summary><button id="tExport">${nt('backup')}</button><button id="tImport">${nt('restore')}</button></details>
  </main>${bottomNav(view)}`;
  bindLang(app);
  const input=app.querySelector('#recipeSearch');
  input.oninput=()=>{f.query=input.value;app.querySelector('#clearSearch').hidden=!f.query;syncBrowseURL();drawDeck();};
  app.querySelector('#clearSearch').onclick=()=>{input.value='';input.oninput();input.focus();};
  app.querySelector('#ingredientFilter').onchange=e=>{f.category=e.target.value;syncBrowseURL();drawDeck();};
  app.querySelector('#cuisineFilter').onchange=e=>{f.cuisine=e.target.value;syncBrowseURL();drawDeck();};
  app.querySelector('#clearFilters').onclick=()=>{f.query=f.category=f.cuisine='';input.value='';app.querySelector('#ingredientFilter').value='';app.querySelector('#cuisineFilter').value='';app.querySelector('#clearSearch').hidden=true;syncBrowseURL();drawDeck();};
  app.querySelector('#tExport').onclick=tExport;app.querySelector('#tImport').onclick=tImport;
  app.querySelector('.continue-cooking')?.addEventListener('click',rememberBrowse);
  drawDeck();
  requestAnimationFrame(()=>window.scrollTo(0,(location.hash.slice(1)||'/recipes')===returnRoute?returnScroll:0));
}
function drawDeck(){
  const f=browseState[browseView], list=TableCatalog.filter(DATA,{...f,saved:browseView==='saved'},validSaved());
  const pool=browseView==='saved'?DATA.filter(r=>isSaved(r.id)):DATA;
  app.querySelector('.browse-heading .eyebrow span').textContent=' / '+pool.length;
  app.querySelectorAll('#ingredientFilter option[value]').forEach(option=>{if(!option.value)return;const count=pool.filter(r=>r.category===option.value).length;option.textContent=option.value+' · '+count;option.disabled=!count;});
  app.querySelectorAll('#cuisineFilter option[value]').forEach(option=>{if(option.value)option.disabled=!pool.some(r=>r.cuisine===option.value);});
  app.querySelector('#resultCount').textContent=`${list.length} ${nt(list.length===1?'oneResult':'results')}`;
  app.querySelector('#clearFilters').hidden=!(f.query||f.category||f.cuisine);
  const emptySaved=browseView==='saved'&&!validSaved().length;
  app.querySelector('#deck').innerHTML=list.length?list.map(card).join(''):`<div class="browse-empty">${ni(emptySaved?'saved':'search')}<h2>${nt(emptySaved?'noSaved':'noResults')}</h2><p>${nt(emptySaved?'noSavedHelp':'noResultsHelp')}</p>${emptySaved?`<a class="primary-action" href="#/recipes">${nt('browse')}</a>`:''}</div>`;
  app.querySelectorAll('.recipe-link').forEach(link=>link.addEventListener('click',rememberBrowse));
  app.querySelectorAll('.card').forEach(el=>el.onclick=e=>{if(e.target.closest('a,button'))return;rememberBrowse();go('/r/'+el.dataset.id);});
  wireBookmarks();refreshNav(browseView);
}
function card(r,i){
  const rating=store.fb[r.id]?.rating, kcal=(r.macro.split('|')[0]||'').trim(), p=cookProgress(r);
  return `<article class="card" data-id="${esc(r.id)}" style="animation-delay:${Math.min(i*35,200)}ms"><div class="band"></div><div class="cbody"><div class="toprow"><span class="stamp">${esc(r.cuisine)}</span>${saveButton(r)}</div><h3><a class="recipe-link" href="#/r/${esc(r.id)}">${esc(r.title)}</a></h3>${r.subtitle?`<div class="sub">${esc(r.subtitle)}</div>`:''}<div class="macro">${kcal?`<span class="pill kcal">${esc(kcal)}</span>`:''}<span class="pill">${esc(r.category)}</span><span class="pill">${esc(r.serves)}</span>${rating?ratingDot(rating):''}</div>${p?`<div class="resume">${nt('continue')} · ${nt('step')} ${p.next} ${nt('of')} ${p.total}</div>`:''}</div></article>`;
}
function detailNavigation(r){return `<div class="recipe-tools">${saveButton(r,true)}<button class="shopping-action" data-add-shopping="${esc(r.id)}" aria-pressed="${chosenRecipes().includes(r.id)}">${ni('shopping')}<span>${nt(chosenRecipes().includes(r.id)?'inShopping':'addShopping')}</span></button></div>`;}
function wireDetailNavigation(){wireBookmarks();app.querySelector('[data-add-shopping]')?.addEventListener('click',e=>{const b=e.currentTarget,id=b.dataset.addShopping;store.shoppingRecipes=chosenRecipes().includes(id)?chosenRecipes().filter(x=>x!==id):[...chosenRecipes(),id];save();b.setAttribute('aria-pressed',chosenRecipes().includes(id));b.querySelector('span').textContent=nt(chosenRecipes().includes(id)?'inShopping':'addShopping');refreshNav('');});}
function renderShop(){
  window.scrollTo(0,0);wantWake=false;releaseWake();
  const ids=chosenRecipes(), rows=TableCatalog.shopping(DATA,ids,store.lang), sh=store.shop||{};
  const section=key=>{const items=rows.filter(x=>x.aisle===key);return !items.length?'':`<section class="sec shop-section"><h4>${nt(key)} <span>${items.length}</span></h4><ul class="ilist">${items.map(row=>`<li data-shop="${esc('recipe:'+row.key)}" class="${sh['recipe:'+row.key]?'done':''}" role="checkbox" aria-checked="${!!sh['recipe:'+row.key]}" tabindex="0"><span class="ck">${ICON_CHECK}</span><span class="itxt">${esc(row.text)}<small>${nt('from')} ${esc(row.title)}</small></span></li>`).join('')}</ul></section>`;};
  app.innerHTML=header()+`<main class="shopping-page"><div class="browse-heading"><p class="eyebrow">${nt('shopping')}</p><h1>${nt('shopTitle')}</h1><p class="intro">${nt('shopIntro')}</p></div>${ids.length?`<div class="shopping-selection"><div><strong>${ids.length} ${nt(ids.length===1?'dish':'dishes')}</strong><button class="text-action" id="chooseDishes">${nt('change')}</button></div>${DATA.filter(r=>ids.includes(r.id)).map(r=>`<div class="chosen-dish"><a href="#/r/${esc(r.id)}">${esc(r.title)}</a><button data-remove-dish="${esc(r.id)}" aria-label="${nt('remove')} ${esc(r.title)}">×</button></div>`).join('')}</div><div class="shopping-progress"><span id="shopProgress"></span><button class="text-action" id="shopReset">${nt('uncheck')}</button></div><p class="quantity-note">${nt('recipeAmounts')}</p>${section('protein')}${section('produce')}${section('pantry')}`:`<div class="browse-empty shopping-empty">${ni('shopping')}<h2>${nt('emptyShop')}</h2><p>${nt('emptyShopHelp')}</p><button class="primary-action" id="chooseDishes">${nt('choose')}</button></div>`}<p class="device-note">${nt('shopDevice')}</p></main>${bottomNav('shopping')}`;
  bindLang(app);app.querySelector('#chooseDishes').onclick=openDishPicker;
  app.querySelectorAll('.chosen-dish a').forEach(a=>a.onclick=()=>{returnRoute='/shop';returnScroll=window.scrollY;});
  const progress=()=>{const done=rows.filter(x=>store.shop?.['recipe:'+x.key]).length;const p=app.querySelector('#shopProgress');if(p)p.textContent=`${done} / ${rows.length} ${nt('checked')}`;};progress();
  app.querySelectorAll('[data-shop]').forEach(li=>{const toggle=()=>{const key=li.dataset.shop;store.shop=store.shop||{};if(store.shop[key])delete store.shop[key];else store.shop[key]=1;save();li.classList.toggle('done',!!store.shop[key]);li.setAttribute('aria-checked',!!store.shop[key]);progress();};li.onclick=toggle;li.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}};});
  app.querySelectorAll('[data-remove-dish]').forEach(b=>b.onclick=()=>{store.shoppingRecipes=chosenRecipes().filter(id=>id!==b.dataset.removeDish);save();renderShop();});
  app.querySelector('#shopReset')?.addEventListener('click',()=>{for(const row of rows)delete (store.shop||{})['recipe:'+row.key];save();renderShop();});
}
function openDishPicker(){
  const dialog=document.createElement('dialog');dialog.className='dish-picker';dialog.setAttribute('aria-labelledby','pickerTitle');
  const draft=new Set(chosenRecipes());
  dialog.innerHTML=`<form><header><h2 id="pickerTitle">${nt('choose')}</h2><button type="button" data-close-picker aria-label="${nt('close')}">×</button></header><label class="picker-search"><span class="sr-only">${nt('searchLabel')}</span><input type="search" placeholder="${nt('search')}" aria-label="${nt('searchLabel')}"></label><div class="picker-list">${DATA.map(r=>`<label data-picker-row="${esc(r.id)}"><input type="checkbox" value="${esc(r.id)}" ${draft.has(r.id)?'checked':''}><span><strong>${esc(r.title)}</strong><small>${esc(r.cuisine)} · ${esc(r.category)}</small></span></label>`).join('')}<p class="picker-no-results" hidden>${nt('noResults')}</p></div><footer><button class="primary-action" type="submit">${nt('use')} <span>${draft.size}</span></button></footer></form>`;
  document.body.appendChild(dialog);dialog.showModal();
  const close=()=>{dialog.close();dialog.remove();app.querySelector('#chooseDishes')?.focus();};
  dialog.querySelector('[data-close-picker]').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.onclick=e=>{if(e.target===dialog)close();};
  dialog.querySelectorAll('[type=checkbox]').forEach(input=>input.onchange=()=>{input.checked?draft.add(input.value):draft.delete(input.value);dialog.querySelector('footer span').textContent=draft.size;});
  dialog.querySelector('[type=search]').oninput=e=>{let count=0;dialog.querySelectorAll('[data-picker-row]').forEach(row=>{row.hidden=!TableCatalog.matches(DATA.find(r=>r.id===row.dataset.pickerRow),e.target.value);if(!row.hidden)count++;});dialog.querySelector('.picker-no-results').hidden=count>0;};
  dialog.querySelector('form').onsubmit=e=>{e.preventDefault();store.shoppingRecipes=[...draft];save();dialog.close();dialog.remove();renderShop();app.querySelector('#chooseDishes')?.focus();};
}
