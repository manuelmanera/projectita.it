// tracker.js - Segnala l'utente attivo su Firebase
(function () {
  function sendPresence() {
    let currentUser = { username: 'Anonimo', email: 'N/D' };
    
    try {
      const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (savedUser) currentUser = JSON.parse(savedUser);
    } catch (e) {}

    // Dati dell'utente attivo
    const userData = {
      username: currentUser.username || currentUser.catName || 'Anonimo',
      email: currentUser.email || 'N/D',
      page: window.location.pathname || '/index.html',
      lastSeen: Date.now(),
      userAgent: navigator.userAgent
    };

    // Scrive il heartbeat su Firebase Realtime Database
    // Usa l'istanza firebase già presente nella tua app web!
    if (window.firebase && firebase.database) {
      const userKey = (currentUser.email || currentUser.username || 'anon_' + Date.now()).replace(/[.#$\[\]]/g, "_");
      firebase.database().ref('active_users/' + userKey).set(userData);
    }
  }

  // Manda il segnale all'apertura e ogni 30 secondi
  sendPresence();
  setInterval(sendPresence, 30000);
})();
