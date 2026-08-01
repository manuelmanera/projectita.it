// tracker.js - Invia la presenza dell'utente al server di tracciamento
(function () {
  function trackUserPresence() {
    // Prova a recuperare l'utente se salvato in localStorage o sessionStorage
    // (Adatta 'user' se nella tua app usi una chiave diversa)
    let currentUser = { username: 'Anonimo', email: 'N/D' };
    
    try {
      const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
      }
    } catch (e) {
      // Se non è in formato JSON o c'è un errore, lascia default
    }

    const payload = {
      user: currentUser.username || currentUser.name || 'Anonimo',
      email: currentUser.email || 'N/D',
      page: window.location.pathname, // Es: /index.html, /feed.html, ecc.
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    // Invia il ping al tuo bot Node.js (porta 3000)
    fetch('http://localhost:3000/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => {
      // Ignora silenziosamente se il bot di tracciamento è spento
    });
  }

  // Esegui subito all'apertura della pagina
  trackUserPresence();

  // Manda un ping ogni 30 secondi per segnalare che l'utente è ancora attivo
  setInterval(trackUserPresence, 30000);
})();
