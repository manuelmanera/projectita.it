importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDAwgqotGF0BTUGBjxOMseMMfXpBZdAUTI",
  authDomain: "meowmaster-51991.firebaseapp.com",
  databaseURL: "https://meowmaster-51991-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "meowmaster-51991",
  storageBucket: "meowmaster-51991.firebasestorage.app",
  messagingSenderId: "1079993425259",
  appId: "1:1079993425259:web:1aa6a9e5f0a65b6ee4802e"
});

const messaging = firebase.messaging();

// Gestione Notifica Push Nativa in Background (App chiusa o ridotta a icona)
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || "MeowGo 🐾";
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || './icons/icon-512.png',
    image: payload.notification.image || null, // Immagine grande del gatto nella notifica
    badge: './icons/icon-512.png',
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || './feed.html'
    },
    actions: [
      { action: 'open', title: '👀 Guarda Feed' },
      { action: 'close', title: 'Chiudi' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Click sulla notifica nativa
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  const targetUrl = event.notification.data?.url || './feed.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes('feed.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

