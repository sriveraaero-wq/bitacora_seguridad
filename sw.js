// Service worker: solo cachea el "cascarón" de la app (HTML, config, íconos)
// para que abra rápido y funcione sin conexión. Los datos (reportes, usuarios)
// siguen requiriendo conexión a internet, ya que viven en Firestore.

var CACHE_NAME = "bitacora-seguridad-v1";
var APP_SHELL = [
  "./",
  "./index.html",
  "./firebase-config.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE_NAME; })
            .map(function(key){ return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event){
  var url = new URL(event.request.url);

  // Solo intervenimos peticiones a nuestro propio sitio (el "cascarón").
  // Todo lo demás (Firestore, Firebase SDK, Google Fonts) va directo a la red,
  // sin pasar por caché, para no servir datos ni sesiones desactualizadas.
  if(url.origin === self.location.origin){
    event.respondWith(
      caches.match(event.request).then(function(cached){
        return cached || fetch(event.request);
      })
    );
  }
});
