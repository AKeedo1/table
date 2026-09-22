/* Table — service worker. Canonical pattern (2.1): ordered install, cache only OK
   responses, network-first raced against a 2.5s timeout, HTML fallback for navigations. */
const CACHE = 'table-wayfinding-v1';
const SHELL = ['./', './index.html', './styles.css?v=wayfinding-1', './wayfinding.css?v=wayfinding-1', './app.js', './catalog.js?v=wayfinding-1', './navigation.js?v=wayfinding-1', './table.js?v=wayfinding-1', './manifest.webmanifest',
  './recipes.json',
  './assets/icon-192.png', './assets/icon-512.png'];

self.addEventListener('install', e=>{
  // ordered: precache the shell FIRST, then take over — don't skipWaiting before addAll (2.1)
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(async path=>{ const url=new URL(path,self.location.href); if(path==='./'||path==='./index.html')url.searchParams.set('v',CACHE); const response=await fetch(url,{cache:'reload'}); if(!response.ok)throw new Error('Cannot cache '+path); await c.put(path,response); }))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('table-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  const url = new URL(e.request.url);
  // Google Fonts (Fraunces) — cache-first so the display type works offline after one online load (Batch 5)
  if(url.host==='fonts.googleapis.com' || url.host==='fonts.gstatic.com'){
    e.respondWith(caches.match(e.request).then(hit=> hit || fetch(e.request).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{}); return res; }).catch(()=>hit)));
    return;
  }
  if(url.origin!==self.location.origin) return;   // cross-origin → straight to network
  // 1.8 — recipes.json ships with a ?v= cache-buster (to beat GH Pages' 10-min HTTP cache).
  // Cache it under the CLEAN url and match ignoring the query, else offline never finds it
  // (and one dead cache entry leaks per launch).
  if(url.origin===self.location.origin && url.pathname.endsWith('/recipes.json')){
    const clean = url.origin + url.pathname;
    e.respondWith(
      fetch(e.request).then(r=>{
        if(r.ok){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(clean, cp)); }
        return r;
      }).catch(()=>caches.match(clean).then(r=>r||caches.match('./recipes.json',{ignoreSearch:true})))
    );
    return;
  }
  // same-origin shell: network-first raced against a 2.5s timeout; cache only OK (2.1)
  e.respondWith((async ()=>{
    const cached = await caches.match(e.request);
    // Installed apps must not reuse an older HTML response from the host's HTTP cache.
    const navigationURL=new URL(e.request.url);
    navigationURL.searchParams.set('table-build',CACHE);
    const request=e.request.mode==='navigate'?fetch(navigationURL,{cache:'no-cache',credentials:'same-origin'}):fetch(e.request);
    const net = request.then(r=>{ if(r&&r.ok){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request, cp)).catch(()=>{}); } return r; });
    const timeout = new Promise(res=>setTimeout(()=>res('__t__'), 2500));
    const w = await Promise.race([net.catch(()=>'__e__'), timeout]);
    if(w && w!=='__t__' && w!=='__e__' && w.ok) return w;
    if(cached) return cached;
    try{ const r = await net; if(r) return r; }catch(e2){}
    if(e.request.mode==='navigate') return (await caches.match('./index.html')) || Response.error();
    return Response.error();
  })());
});
