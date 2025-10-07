const CACHE_NAME = 'gamebet-pwa-v1';
const ASSETS = [
  '/GameBet2.0-/docs/',
  '/GameBet2.0-/docs/index.html',
  '/GameBet2.0-/docs/manifest.webmanifest',
  '/GameBet2.0-/docs/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match('/GameBet2.0-/docs/')))
  );
});
