const CACHE_NAME = "travel-packing-v10-16-2";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => { if (e.request.mode === "navigate") { e.respondWith(fetch(e.request).then(r => { const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)); return r; }).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html")))); return; } e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => { const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)); return r; }))); });
