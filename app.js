/* ================================================================
   Table — recipes
   ================================================================ */
'use strict';

const KEY = 'bah.kitchen.v1';
const RATINGS = [
  {r:'love',  en:'Loved', tl:'Paborito'},
  {r:'good',  en:'Good',  tl:'Masarap'},
  {r:'tweak', en:'Tweak', tl:'Ayusin'},
  {r:'kill',  en:'Kill',  tl:'Tanggal'},
];
const T = {
  en:{tagline:'Every recipe in one place — cook it, rate it, keep what works.',
      all:'All', ingredients:'Ingredients', method:'Method', feedback:'How was it?',
      cook:'Cook Mode', note:'Notes — what to change next time…', saved:'Saved',
      back:'Library', serves:'', prep:'Prep', nofilter:'Nothing here yet.',
      tlmiss:'Tagalog coming soon for this dish — showing English.'},
  tl:{tagline:'Lahat ng recipe sa isang lugar — lutuin, i-rate, itago ang bumagay.',
      all:'Lahat', ingredients:'Sangkap', method:'Paraan', feedback:'Kumusta ang luto?',
      cook:'Cook Mode', note:'Tala — ano ang babaguhin sa susunod…', saved:'Nai-save',
      back:'Recipe', serves:'', prep:'Paghahanda', nofilter:'Wala pang laman dito.',
      tlmiss:'Malapit nang idagdag ang Tagalog para dito — Ingles muna.'},
};
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6"/></svg>';
const ICON_BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
const ICON_COOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a4 4 0 0 1 4 4c0 1.5-.8 2.5-1.5 3.2L14 21h-4l-.5-10.8C8.8 9.5 8 8.5 8 7a4 4 0 0 1 4-4z"/></svg>';

/* monogram mark */
const MARK = `<svg viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="#cf6244"/><text x="20" y="28" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="21" font-weight="700" fill="#fdeee6">T</text></svg>`;

/* ── state ──────────────────────────────────────────────────────── */
let DATA = [];
let COLLECTIONS = ['Week 9','Winners'];   // 3.5 — overwritten from recipes.json
let store = load();
function load(){ try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}} }
// 2.2 — Table's save() was unguarded (throws in Safari private mode); wrap + flag on failure
let storageFailed=false;
function flagStorageFail(){ if(storageFailed)return; storageFailed=true; try{ const el=document.createElement('div'); el.textContent='Storage failing — back up your notes now.'; el.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:9999;padding:10px 16px;font-size:12px;text-align:center;background:#241a14;color:#cf6244;border-top:1px solid #cf6244;opacity:.96'; document.body.appendChild(el);}catch(e){} }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){ flagStorageFail(); } }
// 2.7 — escape user text before innerHTML (feedback note could contain </textarea>)
const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
store.lang = store.lang || 'en';
store.fb = store.fb || {};
try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}   // 2.2
function t(k){ return T[store.lang][k]; }
// Batch 5 a11y — <html lang> follows the EN/TL toggle
function applyLang(){ try{ document.documentElement.lang = store.lang==='tl'?'tl':'en'; }catch(e){} }
applyLang();
// Appearance: manual toggle, persisted. auto (follows system) -> light -> dark -> auto
store.theme = store.theme || 'auto';
const THEME_ORDER=['auto','light','dark'], THEME_LABEL={auto:'Auto',light:'Light',dark:'Dark'};
const _mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function effectiveTheme(){ return store.theme==='auto' ? (_mq && _mq.matches ? 'dark':'light') : store.theme; }
function applyTheme(){ try{ document.documentElement.setAttribute('data-theme', effectiveTheme()); }catch(e){} }
applyTheme();
if(_mq){ try{ _mq.addEventListener('change', ()=>{ if(store.theme==='auto') applyTheme(); }); }catch(e){ try{ _mq.addListener(()=>{ if(store.theme==='auto') applyTheme(); }); }catch(e2){} } }
function cycleTheme(){ store.theme = THEME_ORDER[(THEME_ORDER.indexOf(store.theme)+1)%THEME_ORDER.length]; save(); applyTheme(); }
function themeBtn(){ return `<button class="themebtn" data-theme-btn aria-label="Appearance: ${THEME_LABEL[store.theme]}">${THEME_LABEL[store.theme]}</button>`; }
document.addEventListener('click', (e)=>{ const b=e.target.closest('[data-theme-btn]'); if(!b) return; cycleTheme(); const l=THEME_LABEL[store.theme]; b.textContent=l; b.setAttribute('aria-label','Appearance: '+l); });

const app = document.getElementById('app');

/* ── Batch 3 helpers ────────────────────────────────────────────── */
let scale = 1;                          // 3.8 servings multiplier (per open recipe)
let wantWake = false, wakeLock = null;  // 3.1 wake lock

// one-time functional styles for chips / ribbons / toast (Batch 5 refines the look)
(function injectStyles(){ try{ const s=document.createElement('style'); s.textContent=
   '.tchip{display:inline-flex;align-items:center;font:inherit;font-size:.85em;line-height:1;padding:2px 9px;margin:0 2px;border:1px solid var(--gold-deep,#cf6244);border-radius:20px;background:none;color:var(--gold-deep,#cf6244);cursor:pointer;vertical-align:baseline}'
  +'.tchip.running{background:var(--gold-deep,#cf6244);color:#fff}'
  +'.tchip.done{opacity:.5;text-decoration:line-through}'
  +'.resume{margin-top:8px;font-size:11px;letter-spacing:.02em;color:var(--gold-deep,#cf6244);font-weight:600}'
  +'.scaler{float:right;display:inline-flex;gap:2px;font-size:12px}'
  +'.scaler button{background:none;border:1px solid #d8c9ba;color:#8a7f72;border-radius:14px;padding:2px 9px;font:inherit;font-size:12px;cursor:pointer}'
  +'.scaler button.on{background:var(--gold-deep,#cf6244);color:#fff;border-color:var(--gold-deep,#cf6244)}'
  +'.resetchecks{margin:14px 0 0;background:none;border:0;color:#8a7f72;font:inherit;font-size:12px;text-decoration:underline;cursor:pointer}'
  +'.shopbtn{display:block;width:100%;margin:2px 0 0;padding:12px;border:1px solid #d8c9ba;border-radius:14px;background:none;color:var(--gold-deep,#cf6244);font:inherit;font-weight:600;cursor:pointer}'
  +'.toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:9998;background:#2a211c;color:#fdeee6;padding:10px 18px;border-radius:20px;font-size:13px;opacity:0;transition:opacity .3s;box-shadow:0 6px 20px rgba(0,0,0,.3)}';
   document.head.appendChild(s); }catch(e){} })();

// 3.1 wake lock — keep the screen on while reading a recipe / cooking; iOS releases on background.
async function acquireWake(){ try{ if('wakeLock' in navigator && !wakeLock){ wakeLock=await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release',()=>{ wakeLock=null; }); } }catch(e){} }
function releaseWake(){ try{ if(wakeLock){ wakeLock.release(); wakeLock=null; } }catch(e){} }

// 3.2 persisted checks (ingredients + steps), shared by detail & cook
function checksFor(id){ return (store.checks && store.checks[id]) || {}; }
function setCheck(id,k,on){ store.checks=store.checks||{}; store.checks[id]=store.checks[id]||{}; if(on) store.checks[id][k]=1; else delete store.checks[id][k]; save(); }
function clearChecks(id){ if(store.checks) delete store.checks[id]; save(); }
function cookProgress(r){ const ck=checksFor(r.id), total=(r.steps||[]).length; if(!total) return null; let done=0; for(let i=0;i<total;i++) if(ck['s:'+r.id+':'+i]) done++; if(done<=0||done>=total) return null; return {done,total,next:Math.min(done+1,total)}; }

// 3.6 step timers + chime
const chipTimers = new WeakMap();
let _actx=null;
function chime(){ try{ _actx=_actx||new (window.AudioContext||window.webkitAudioContext)(); if(_actx.state==='suspended')_actx.resume(); const t0=_actx.currentTime; [[880,0,.18],[1320,.14,.22]].forEach(([f,o,d])=>{ const osc=_actx.createOscillator(),g=_actx.createGain(); osc.type='sine'; osc.frequency.value=f; g.gain.setValueAtTime(.0001,t0+o); g.gain.exponentialRampToValueAtTime(.15,t0+o+.02); g.gain.exponentialRampToValueAtTime(.0001,t0+o+d); osc.connect(g).connect(_actx.destination); osc.start(t0+o); osc.stop(t0+o+d+.05); }); }catch(e){} }
function timerize(text){ return text.replace(/(\d+(?:\s*[–-]\s*\d+)?)\s*(min(?:ute)?s?|sec(?:ond)?s?)\b/gi, (m,num,unit)=>{ const up=parseInt(String(num).split(/[–-]/).pop(),10)||0; const secs=/^min/i.test(unit)?up*60:up; if(!secs||secs>3600) return m; return `<button class="tchip" data-sec="${secs}" data-label="${m.trim()}">${m.trim()}</button>`; }); }
function startChip(chip){ if(chipTimers.has(chip)){ clearInterval(chipTimers.get(chip)); chipTimers.delete(chip); chip.classList.remove('running'); chip.textContent=chip.dataset.label; return; } let left=parseInt(chip.dataset.sec,10); chip.classList.remove('done'); chip.classList.add('running'); const paint=()=>{ const m=Math.floor(left/60),s=left%60; chip.textContent=m+':'+String(s).padStart(2,'0'); }; paint(); const iv=setInterval(()=>{ left--; if(left<=0){ clearInterval(iv); chipTimers.delete(chip); chip.classList.remove('running'); chip.classList.add('done'); chip.textContent='done'; chime(); } else paint(); },1000); chipTimers.set(chip,iv); }
function wireChips(scope){ scope.querySelectorAll('.tchip').forEach(chip=>chip.onclick=(e)=>{ e.stopPropagation(); startChip(chip); }); }

// 3.8 servings scaler — rescale the leading quantity; handles ranges "2–3" and fraction glyphs; leaves unparseable lines
const FRAC={'½':.5,'⅓':1/3,'⅔':2/3,'¼':.25,'¾':.75,'⅛':.125,'⅜':.375,'⅝':.625,'⅞':.875};
function fmtQty(n){ const r=Math.round(n*100)/100; return Math.abs(r-Math.round(r))<.001?String(Math.round(r)):String(r); }
function scaleLine(line, mult){ if(mult===1) return line; const m=line.match(/^(\s*)([½⅓⅔¼¾⅛⅜⅝⅞]|\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?/); if(!m) return line; const toNum=x=>FRAC[x]!==undefined?FRAC[x]:parseFloat(x); const a=toNum(m[2]); if(isNaN(a)) return line; const rep = m[3]!==undefined ? fmtQty(a*mult)+'–'+fmtQty(toNum(m[3])*mult) : fmtQty(a*mult); return m[1]+rep+line.slice(m[0].length); }
function scalerHTML(){ return `<span class="scaler">${[1,2,3].map(n=>`<button data-scale="${n}" class="${scale===n?'on':''}">×${n}</button>`).join('')}</span>`; }

// 3.7 shopping-list categoriser
function categorize(s){ const PRO=/chicken|beef|lamb|salmon|fish|hammour|sea bass|grouper|\bcod\b|\begg\b|edamame|tofu|sirloin|thigh|breast|shrimp|prawn/; const PROD=/onion|garlic|ginger|tomato|cucumber|spinach|cabbage|carrot|eggplant|broccoli|broccolini|green bean|long bean|bean sprout|sprout|lemon|lime|parsley|cilantro|coriander|mint|\bdill\b|basil|chili|chilies|scallion|spring onion|avocado|cauliflower|zucchini|pomegranate|lettuce|mushroom|potato|\bpear\b|\bapple\b|shallot|leaves|\bherb/; if(PRO.test(s)) return 'Protein'; if(PROD.test(s)) return 'Produce'; return 'Pantry'; }

// small quiet toast
function toast(msg){ try{ const el=document.createElement('div'); el.className='toast'; el.textContent=msg; document.body.appendChild(el); requestAnimationFrame(()=>el.style.opacity='1'); setTimeout(()=>{ el.style.opacity='0'; setTimeout(()=>el.remove(),400); },2600); }catch(e){} }

/* ── boot ───────────────────────────────────────────────────────── */
function loadData(){
  return fetch('recipes.json?v=' + Date.now(), {cache:'no-store'})
    .then(r=>r.json()).then(j=>{
      DATA = j.recipes; COLLECTIONS = j.collections || COLLECTIONS;
      const sig = DATA.length + ':' + COLLECTIONS.join(',');       // 3.5 — detect a fresh drop
      const changed = store.dataSig && store.dataSig !== sig;
      store.dataSig = sig; save();
      return changed;
    }).catch(()=>false);
}
// boot skeleton while the first fetch resolves (Batch 5)
app.innerHTML = '<div class="deck">'+[0,1,2].map(()=>'<article class="card skeleton"><div class="band"></div><div class="cbody"><div class="skl-line" style="width:55%"></div><div class="skl-line" style="width:78%"></div><div class="skl-line" style="width:35%"></div></div></article>').join('')+'</div>';
loadData().then(changed=>{
  if(!DATA.length){ app.innerHTML='<div class="empty">Could not load recipes.<br><button id="retry" style="margin-top:14px;padding:10px 20px;border:1px solid #d8c9ba;border-radius:12px;background:none;color:var(--accent-deep,#cf6244);font:inherit;cursor:pointer">Retry</button></div>'; const rb=document.getElementById('retry'); if(rb) rb.onclick=()=>location.reload(); return; }
  route();
  if(changed) toast('New recipes are in.');
});
// 3.1/3.2 — re-pull on foreground, but only re-render when data actually changed; keep screen awake
document.addEventListener('visibilitychange', ()=>{
  if(document.visibilityState!=='visible') return;
  if(wantWake) acquireWake();
  loadData().then(changed=>{ if(changed){ toast('New recipes are in.'); if(!document.querySelector('.cook')) route(); } });
});

window.addEventListener('hashchange', route);
window.addEventListener('scroll', onScroll, {passive:true});
function onScroll(){
  const y = window.scrollY;
  const p = document.querySelector('.bg-pattern'); if(p) p.style.setProperty('--par', (y*0.12)+'px');
  const h = document.querySelector('.hdr'); if(h) h.classList.toggle('small', y>40);
}

/* ── router ─────────────────────────────────────────────────────── */
function route(){
  document.querySelectorAll('.cook').forEach(el=>el.remove());   // 3.3 — kill any stranded cook overlay first
  document.body.classList.remove('cook-open');                  // Batch 5 — release body-scroll lock
  const h = location.hash.replace(/^#/,'');
  if(h==='/shop'){ renderShop(); return; }                       // 3.7
  const m = h.match(/^\/(r|cook)\/(.+)$/);
  if(m){ const rec = DATA.find(x=>x.id===m[2]);
    if(rec){ m[1]==='cook' ? renderCook(rec) : renderDetail(rec); return; } }
  renderHome();
}
function go(hash){ location.hash = hash; }
function nav(fn){ if(document.startViewTransition) document.startViewTransition(fn); else fn(); }

/* ── header ─────────────────────────────────────────────────────── */
function header(){
  return `<header class="hdr">
    <div class="mark">${MARK}</div>
    <div class="wordmark">Table<small>recipes</small></div>
    ${themeBtn()}
    ${langPill()}
  </header>`;
}
function langPill(cls=''){
  return `<div class="lang ${cls}">
    <button data-lang="en" class="${store.lang==='en'?'on':''}">EN</button>
    <button data-lang="tl" class="${store.lang==='tl'?'on':''}">TL</button>
  </div>`;
}
function bindLang(scope){
  scope.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>{
    if(store.lang===b.dataset.lang) return;
    store.lang=b.dataset.lang; save(); applyLang(); nav(route);
  });
}

/* ── HOME ───────────────────────────────────────────────────────── */
let filt = {col:'all', cat:'all'};
function renderHome(){
  window.scrollTo(0,0);
  wantWake=false; releaseWake();                                  // 3.1 — screen can sleep on the library
  const cats=[...new Set(DATA.map(r=>r.category))];
  const seg=['all', ...COLLECTIONS];                             // 3.5 — data-driven collections
  app.innerHTML = header() + `
    <div class="filters">
      <div class="seg" id="segCol">
        ${seg.map(c=>`<button data-col="${c}" class="${filt.col===c?'on':''}">${c==='all'?t('all'):c}</button>`).join('')}
      </div>
      <div class="chips" id="chipCat">
        <button class="chip ${filt.cat==='all'?'on':''}" data-cat="all">${t('all')}</button>
        ${cats.map(c=>`<button class="chip ${filt.cat===c?'on':''}" data-cat="${c}">${c}</button>`).join('')}
      </div>
    </div>
    <button class="shopbtn" id="shopBtn">Shopping list${filt.col!=='all'?' · '+filt.col:''}</button>
    <div class="deck" id="deck"></div>
    <div class="datafoot" style="text-align:center;margin:26px 0 40px;font-size:12px;color:#8a7f72;display:flex;gap:10px;justify-content:center;align-items:center">
      <button id="tExport" style="background:none;border:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer">Back up notes</button>
      <span>·</span>
      <button id="tImport" style="background:none;border:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer">Restore</button>
    </div>`;
  bindLang(app);
  app.querySelector('#segCol').onclick = e=>{ const b=e.target.closest('button'); if(!b)return;
    filt.col=b.dataset.col; setOn('#segCol button',b);
    const sb=app.querySelector('#shopBtn'); if(sb) sb.textContent='Shopping list'+(filt.col!=='all'?' · '+filt.col:''); drawDeck(); };
  app.querySelector('#chipCat').onclick = e=>{ const b=e.target.closest('button'); if(!b)return;
    filt.cat=b.dataset.cat; setOn('#chipCat button',b); drawDeck(); };
  app.querySelector('#shopBtn').onclick = ()=>nav(()=>go('/shop'));   // 3.7
  app.querySelector('#tExport').onclick = tExport;   // 2.4
  app.querySelector('#tImport').onclick = tImport;
  drawDeck();
}
// 2.4 — Table's ratings + notes (bah.kitchen.v1) had no backup path. Small, out of the cook's way.
function tExport(){
  const txt = JSON.stringify(store); store.lastBackup = Date.now(); save();
  const fname = 'table-notes-' + new Date().toISOString().slice(0,10) + '.json';
  try{ const file = new File([txt], fname, {type:'application/json'});
    if(navigator.canShare && navigator.canShare({files:[file]})){ navigator.share({files:[file], title:'Table notes'}).catch(()=>{}); return; }
  }catch(e){}
  if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(()=>alert('Notes copied. Paste somewhere safe.')).catch(()=>prompt('Copy your notes:', txt)); }
  else prompt('Copy your notes:', txt);
}
function tImport(){
  const raw = prompt('Paste a notes backup. This replaces your current ratings and notes.');
  if(!raw) return;
  let obj; try{ obj = JSON.parse(raw); }catch(e){ alert("That isn't valid backup JSON."); return; }
  if(!obj || typeof obj!=='object' || !('fb' in obj)){ alert("That doesn't look like Table notes."); return; }
  const n = Object.keys(obj.fb||{}).length;
  if(!confirm('Replace your notes with this backup — ' + n + ' rated recipes?')) return;
  store = obj; store.lang = store.lang||'en'; store.fb = store.fb||{}; save(); route();
}
function setOn(sel,el){ app.querySelectorAll(sel).forEach(x=>x.classList.remove('on')); el.classList.add('on'); }

function drawDeck(){
  const deck = app.querySelector('#deck');
  const list = DATA.filter(r=>(filt.col==='all'||r.collection===filt.col)
                            &&(filt.cat==='all'||r.category===filt.cat));
  if(!list.length){ deck.innerHTML=`<div class="empty">${t('nofilter')}</div>`; return; }
  deck.innerHTML = list.map((r,i)=>card(r,i)).join('');
  deck.querySelectorAll('.card').forEach(c=>c.onclick=()=>nav(()=>go('/r/'+c.dataset.id)));
}
function card(r,i){
  const fb = store.fb[r.id];
  const rd = fb&&fb.rating ? ratingDot(fb.rating) : '';
  const kcal = (r.macro.split('|')[0]||'').trim();
  const p = cookProgress(r);                                      // 3.2 resume ribbon
  return `<article class="card" data-id="${r.id}" style="animation-delay:${Math.min(i*55,400)}ms">
    <div class="band"></div>
    <div class="cbody">
      <div class="toprow">
        <span class="stamp">${r.cuisine}</span>
        ${rd || `<span class="pill">${r.collection}</span>`}
      </div>
      <h3>${r.title}</h3>
      ${r.subtitle?`<div class="sub">${r.subtitle}</div>`:''}
      <div class="macro">
        ${kcal?`<span class="pill kcal">${kcal}</span>`:''}
        <span class="pill">${r.category}</span>
        <span class="pill">${r.serves}</span>
      </div>
      ${p?`<div class="resume">resume cooking · step ${p.next} of ${p.total}</div>`:''}
    </div>
  </article>`;
}
function ratingDot(r){
  const def = RATINGS.find(x=>x.r===r); if(!def) return '';
  return `<span class="rdot ${r}"><i class="g"></i>${def[store.lang]}</span>`;
}

/* ── content resolver (EN canonical, TL overlay w/ fallback) ────── */
function content(r){
  const tl = store.lang==='tl' && r.tl ? r.tl : null;
  return {
    ings: (tl&&tl.ingredients)||r.ingredients,
    steps:(tl&&tl.steps)||r.steps,
    desc: (tl&&tl.description)||r.description,
    missingTL: store.lang==='tl' && (!r.tl),
  };
}

/* ── DETAIL ─────────────────────────────────────────────────────── */
function renderDetail(r){
  window.scrollTo(0,0);
  wantWake=true; acquireWake(); scale=1;                          // 3.1 / 3.8 fresh open
  const c = content(r);
  const meta = r.macro.split('|').map(s=>s.trim()).filter(Boolean);
  const anyChecks = Object.keys(checksFor(r.id)).length>0;
  app.innerHTML = header() + `
    <div class="detail">
      <button class="back">${ICON_BACK}<span>${t('back')}</span></button>
      <div class="masthead"><span class="blob a"></span><span class="blob b"></span><div class="inner">
        <span class="stamp">${r.cuisine}${r.tier?' · '+r.tier:''}</span>
        <h2>${r.title}</h2>
        ${r.subtitle?`<div class="sub">${r.subtitle}</div>`:''}
        <div class="meta">${meta.map((m,i)=>`<span class="pill ${i===0?'kcal':''}">${m}</span>`).join('')}
          <span class="pill">${r.serves}</span></div>
      </div></div>
      ${c.missingTL?`<div class="tlnote">${t('tlmiss')}</div>`:''}
      ${c.desc?`<p class="desc">${c.desc}</p>`:''}

      <section class="sec"><h4>${t('ingredients')}${scalerHTML()}</h4><div id="ingbox">${ingHTML(r.id,c.ings)}</div></section>
      <section class="sec"><h4>${t('method')}</h4>${stepHTML(r.id,c.steps)}</section>
      ${anyChecks?`<button class="resetchecks" id="resetChecks">Uncheck all</button>`:''}

      ${feedbackHTML(r)}
    </div>
    <button class="cookbtn">${ICON_COOK}<span>${t('cook')}</span></button>`;
  bindLang(app);
  app.querySelector('.back').onclick=()=>nav(()=>go('/'));
  app.querySelector('.cookbtn').onclick=()=>nav(()=>go('/cook/'+r.id));
  bindChecks(r.id);
  bindFeedback(r);
  // 3.8 servings scaler — re-render just the ingredient list in place
  app.querySelectorAll('[data-scale]').forEach(b=>b.onclick=()=>{ scale=+b.dataset.scale;
    app.querySelector('#ingbox').innerHTML=ingHTML(r.id,c.ings); bindChecks(r.id);
    app.querySelectorAll('[data-scale]').forEach(x=>x.classList.toggle('on',+x.dataset.scale===scale)); });
  const rc=app.querySelector('#resetChecks'); if(rc) rc.onclick=()=>{ clearChecks(r.id); renderDetail(r); };
}

function ingHTML(id,ings){
  const flat = normalizeIngs(ings);
  return flat.map(g=>`<div class="igroup">
    ${g.group?`<div class="gname">${g.group}</div>`:''}
    <ul class="ilist">${g.items.map((it,i)=>{
      const k='i:'+id+':'+g.gi+':'+i;
      return `<li data-k="${k}" role="checkbox" aria-checked="false" tabindex="0"><span class="ck">${ICON_CHECK}</span><span class="itxt">${scaleLine(it, scale)}</span></li>`;
    }).join('')}</ul></div>`).join('');
}
function stepHTML(id,steps){
  return `<ul class="slist">${steps.map((s,i)=>
    `<li data-k="s:${id}:${i}" role="checkbox" aria-checked="false" tabindex="0"><span class="snum"></span><span class="stxt">${s}</span></li>`).join('')}</ul>`;
}
function normalizeIngs(ings){
  const out=[]; let gi=0;
  ings.forEach(x=>{
    if(x&&typeof x==='object'&&x.items){ out.push({group:x.group||'',items:x.items,gi:gi++}); }
    else { if(!out.length||out[out.length-1].group!==''){ out.push({group:'',items:[],gi:gi++}); }
           out[out.length-1].items.push(x); }
  });
  return out;
}
// 3.2 — checks persist and restore (shared store, shared keys with cook mode); Batch 5 — a11y
function bindChecks(id){
  const ck = checksFor(id);
  app.querySelectorAll('.ilist li, .slist li').forEach(li=>{
    const k=li.dataset.k;
    const set=(on)=>{ li.classList.toggle('done',on); li.setAttribute('aria-checked', on?'true':'false'); };
    if(k) set(!!ck[k]);
    const toggle=()=>{ const on=!li.classList.contains('done'); set(on); if(k) setCheck(id,k,on); };
    li.onclick=toggle;
    li.onkeydown=(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); } };
  });
}

/* ── FEEDBACK ───────────────────────────────────────────────────── */
function feedbackHTML(r){
  const fb = store.fb[r.id]||{};
  return `<div class="fb">
    <h4 style="color:var(--accent-deep,#cf6244)">${t('feedback')}</h4>
    <div class="raterow">
      ${RATINGS.map(x=>`<button class="rate ${fb.rating===x.r?'on':''}" data-r="${x.r}">
        <span class="g"></span>${x[store.lang]}</button>`).join('')}
    </div>
    <textarea class="note" placeholder="${t('note')}">${esc(fb.note)}</textarea>
    <div class="saved">${t('saved')}</div>
  </div>`;
}
function bindFeedback(r){
  const fb = ()=> (store.fb[r.id] = store.fb[r.id]||{});
  const savedEl = app.querySelector('.saved');
  const flash = ()=>{ savedEl.classList.add('show'); clearTimeout(flash._t); flash._t=setTimeout(()=>savedEl.classList.remove('show'),1400); };
  app.querySelectorAll('.rate').forEach(b=>b.onclick=()=>{
    const o=fb(); o.rating = o.rating===b.dataset.r ? null : b.dataset.r; o.ts=Date.now();
    app.querySelectorAll('.rate').forEach(x=>x.classList.remove('on'));
    if(o.rating){ b.classList.add('on','ping'); setTimeout(()=>b.classList.remove('ping'),400); }
    save(); flash();
  });
  const note = app.querySelector('.note');
  let d; note.oninput=()=>{ clearTimeout(d); d=setTimeout(()=>{ fb().note=note.value.trim(); save(); flash(); },500); };
}

/* ── SHOPPING LIST (3.7) ────────────────────────────────────────── */
function renderShop(){
  window.scrollTo(0,0);
  wantWake=false; releaseWake();
  const col=filt.col, list=DATA.filter(r=>col==='all'||r.collection===col);
  const cats={Protein:[],Produce:[],Pantry:[]}, seen=new Set();
  list.forEach(r=> normalizeIngs(r.ingredients).forEach(g=> g.items.forEach(it=>{
    const norm=it.toLowerCase().trim(); if(seen.has(norm)) return; seen.add(norm);
    cats[categorize(norm)].push(it);
  })));
  const sh = store.shop||{};
  const section=(name)=> cats[name].length ? `<section class="sec"><h4>${name}</h4><ul class="ilist">${cats[name].map(it=>{ const k='shop:'+it.toLowerCase().trim(); return `<li data-shop="${k}" class="${sh[k]?'done':''}"><span class="ck">${ICON_CHECK}</span><span class="itxt">${esc(it)}</span></li>`; }).join('')}</ul></section>` : '';
  app.innerHTML = header() + `
    <div class="detail">
      <button class="back">${ICON_BACK}<span>${t('back')}</span></button>
      <div class="masthead"><span class="blob a"></span><span class="blob b"></span><div class="inner">
        <span class="stamp">${col==='all'?'All recipes':col}</span>
        <h2>Shopping list</h2>
        <div class="sub">${seen.size} items · grouped for one-stop shopping</div>
      </div></div>
      ${section('Protein')}${section('Produce')}${section('Pantry')}
      <button class="resetchecks" id="shopReset">Uncheck all</button>
    </div>`;
  bindLang(app);
  app.querySelector('.back').onclick=()=>nav(()=>go('/'));
  app.querySelectorAll('[data-shop]').forEach(li=>li.onclick=()=>{ li.classList.toggle('done'); const k=li.dataset.shop; store.shop=store.shop||{}; if(li.classList.contains('done')) store.shop[k]=1; else delete store.shop[k]; save(); });
  app.querySelector('#shopReset').onclick=()=>{ store.shop={}; save(); renderShop(); };
}

/* ── COOK MODE ──────────────────────────────────────────────────── */
function renderCook(r){
  wantWake=true; acquireWake();                                  // 3.1
  const c = content(r);
  const groups = normalizeIngs(c.ings);
  const ck = checksFor(r.id);
  const cook = document.createElement('div');
  cook.className='cook';
  cook.innerHTML = `
    <div class="ctop">
      <button class="x">×</button>
      <div class="ctitle">${r.title}</div>
      ${themeBtn()}
      ${langPill()}
    </div>
    <div class="cscroll">
      <div class="cstage">${t('ingredients')} · ${r.serves}${scalerHTML()}</div>
      <ul class="cing">${groups.map(g=>
        (g.group?`<li class="gname" style="border:0;cursor:default">${g.group}</li>`:'')+
        g.items.map((it,ii)=>{ const k='i:'+r.id+':'+g.gi+':'+ii; return `<li data-k="${k}" class="${ck[k]?'done':''}">${scaleLine(it, scale)}</li>`; }).join('')).join('')}</ul>
      <div class="cstage">${t('method')}</div>
      ${c.steps.map((s,i)=>{ const k='s:'+r.id+':'+i; return `<div class="cstep ${ck[k]?'done':''}" data-k="${k}"><span class="n">${i+1}</span><p>${timerize(s)}</p></div>`; }).join('')}
    </div>`;
  document.body.appendChild(cook);
  document.body.classList.add('cook-open');                     // Batch 5 — lock body scroll behind the overlay
  bindLang(cook);
  cook.querySelector('.x').onclick=()=>{ cook.remove(); document.body.classList.remove('cook-open'); nav(()=>go('/r/'+r.id)); };
  // 3.2 — check toggles persist; don't toggle when tapping a timer chip (3.6)
  cook.querySelectorAll('.cing li:not(.gname), .cstep').forEach(el=>el.onclick=(e)=>{ if(e.target.closest('.tchip')) return; el.classList.toggle('done'); const k=el.dataset.k; if(k) setCheck(r.id,k,el.classList.contains('done')); });
  wireChips(cook);                                                // 3.6
  cook.querySelectorAll('[data-scale]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); scale=+b.dataset.scale; cook.remove(); renderCook(r); });   // 3.8
  // re-render in place on language change without leaving cook mode
  cook.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>{
    if(store.lang===b.dataset.lang)return; store.lang=b.dataset.lang; save(); applyLang(); cook.remove(); renderCook(r);
  });
}

/* ── service worker ─────────────────────────────────────────────── */
if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
