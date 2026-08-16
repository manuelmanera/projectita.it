// Importa gli script di Firebase necessari per il Service Worker
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

// Gestione dei messaggi in background per mostrare il logo e lo stile di MeowGo
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Ricevuto messaggio in background:', payload);

  const notificationTitle = payload.notification?.title || "MeowGo 🐾";
  const notificationOptions = {
    body: payload.notification?.body || "Nuovo messaggio dallo staff",
    icon: './icons/icon-512.png',
    badge: './icons/icon-512.png',
    image: payload.notification?.image || null,
    vibrate: [100, 50, 100],
    data: {
      url: payload.notification?.click_action || './feed.html'
    },
    actions: [
      { action: 'open', title: '👀 Apri MeowGo' },
      { action: 'close', title: 'Chiudi' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestione del click sulla notifica per aprire l'app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './feed.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes('MeowGo') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
