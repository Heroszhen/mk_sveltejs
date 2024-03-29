self.addEventListener("install", event => {
    // console.log("installed")
    // console.log(event)
    event.waitUntil(self.skipWaiting());
})

self.addEventListener("activate", event => {
    // console.log("activated")
    // console.log(event)
    event.waitUntil(
        //self.clients.claim(),
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
})

self.addEventListener("fetch", event => {

})

/*
// Cache Name
const CACHE_NAME = "static-cache-v1";
// Cache Files
const FILES_TO_CACHE = ["/offline.html"];
// install
self.addEventListener("install", (evt) => {
    console.log("[ServiceWorker] Install");
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[ServiceWorker] Pre-caching offline page");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});
// Active PWA Cache and clear out anything older
self.addEventListener("activate", (evt) => {
    console.log("[ServiceWorker] Activate");
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("[ServiceWorker] Removing old cache", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
// listen for fetch events in page navigation and return anything that has been cached
self.addEventListener("fetch", (evt) => {
    console.log("[ServiceWorker] Fetch", evt.request.url);
    // when not a navigation event return
    if (evt.request.mode !== "navigate") {
        return;
    }
    evt.respondWith(
        fetch(evt.request).catch(() => {
            return caches.open(CACHE_NAME).then((cache) => {
                return cache.match("offline.html");
            });
        })
    );
});*/