const CACHE_NAME = 'meowgo-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './feed.html',
  './garden.html',
  './profile.html',
  './manifest.json',
  './sw.js',
  './tracker.js',
  './icons/icon-192.jpg',
  './icons/icon-512.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
