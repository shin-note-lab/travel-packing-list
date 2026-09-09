const CACHE_NAME="travel-packing-v10-12-7";
const STATIC_ASSETS=["./manifest.webmanifest"];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;

  const request=event.request;
  const url=new URL(request.url);

  // HTML/navigation is always network-first.
  // This prevents an old app screen from remaining after GitHub Pages updates.
  if(request.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/travel-packing-list/")){
    event.respondWith(
      fetch(request,{cache:"no-store"}).then(response=>{
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy));
        return response;
      }).catch(()=>caches.match("./index.html"))
    );
    return;
  }

  // Other local assets can use cache-first.
  event.respondWith(
    caches.match(request).then(cached=>{
      return cached || fetch(request).then(response=>{
        if(url.origin===self.location.origin){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
        }
        return response;
      });
    })
  );
});
