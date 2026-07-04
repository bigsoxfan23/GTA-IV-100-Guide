const CACHE='gta-iv-companion-v2.1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return resp}).catch(()=>caches.match('./index.html'))))});
