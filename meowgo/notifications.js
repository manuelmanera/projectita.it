import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Configurazione Firebase del tuo progetto
const firebaseConfig = {
  apiKey: "AIzaSyDAwgqotGF0BTUGBjxOMseMMfXpBZdAUTI",
  authDomain: "meowmaster-51991.firebaseapp.com",
  databaseURL: "https://meowmaster-51991-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "meowmaster-51991",
  storageBucket: "meowmaster-51991.firebasestorage.app",
  messagingSenderId: "1079993425259",
  appId: "1:1079993425259:web:1aa6a9e5f0a65b6ee4802e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Recupera l'ID dell'utente attualmente loggato (es. da localStorage o sessione)
const currentUserId = localStorage.getItem('meowgo_uid'); 

// 1. Chiedi il permesso all'utente per le notifiche di sistema
async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

// 2. Ascolta i nuovi messaggi inviati dall'Admin su Firebase
function listenForAdminNotifications() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  // Ascolta notifiche dirette all'utente
  if (currentUserId) {
    onChildAdded(ref(db, `notifications/direct/${currentUserId}`), (snapshot) => {
      const notif = snapshot.val();
      if (notif) showSystemNotification(notif.title, notif.body || notif.message);
    });
  }

  // Ascolta notifiche globali
  onChildAdded(ref(db, 'notifications/global'), (snapshot) => {
    const notif = snapshot.val();
    if (notif) showSystemNotification(notif.title, notif.body || notif.message);
  });
}

// 3. Mostra la notifica nel centro notifiche tramite Service Worker
function showSystemNotification(title, body) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title || "MeowGo", {
        body: body || "Hai una nuova notifica!",
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        vibrate: [100, 50, 100],
        data: { url: './garden.html' }
      });
    });
  }
}

// Inizializzazione all'apertura della pagina
document.addEventListener('DOMContentLoaded', () => {
  requestNotificationPermission().then(() => {
    listenForAdminNotifications();
  });
});
