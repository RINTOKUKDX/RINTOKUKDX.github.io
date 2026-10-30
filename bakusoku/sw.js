/* 爆速動画: オフラインでも開けるように、取ってきた物を控えておく(毎回まずネットを見に行き、つながらない時だけ控えを使う) */
const C='bakusoku-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||r.headers.has('range'))return;
  const u=new URL(r.url);if(u.pathname.endsWith('version.txt'))return;
  if(u.protocol!=='https:'&&u.protocol!=='http:')return;
  e.respondWith((u.origin===location.origin?fetch(r.url,{cache:'no-cache',credentials:'same-origin'}):fetch(r)).then(res=>{if(res&&res.ok&&(res.type==='basic'||res.type==='cors')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}return res})
    .catch(()=>caches.match(r,{ignoreSearch:u.origin===location.origin}).then(m=>m||Response.error())))});
