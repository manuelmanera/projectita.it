const CACHE_NAME = 'meowgo-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './feed.html',
  './garden.html',
  './profile.html',
  './calendar.html',
  './search.html',
  './profile-view.html',
  './manifest.json',
  './tracker.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Installazione: salvataggio file statici in cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Attivazione: rimozione vecchie versioni della cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch: servire i file offline se presenti in cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});

// ==========================================
// RICEZIONE NOTIFICHE PUSH (CENTRO NOTIFICHE SISTEMA)
// ==========================================
self.addEventListener('push', (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "MeowGo", body: event.data.text() };
    }
  }

  // Estrazione dati dal payload FCM o personalizzato
  const title = data.title || data.notification?.title || 'Nuova Notifica MeowGo';
  const options = {
    body: data.body || data.message || data.notification?.body || 'Hai una nuova notifica!',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || data.data?.url || './garden.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ==========================================
// GESTIONE CLICK SULLA NOTIFICA
// ==========================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || './garden.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
