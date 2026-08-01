/**
 * MeowGo Web Traffic Tracker
 * Invia i dati di navigazione al server di analisi su PowerShell
 */
(function () {
  // ⚠️ SOSTITUISCI QUESTO URL CON IL TUO LINK GENERATO DA NGROK
  const NGROK_URL = 'https://xxxx-xx-xx-xx.ngrok-free.app';

  function trackUserPresence() {
    let currentUser = { username: 'Anonimo', email: 'N/D' };

    // Tenta di recuperare i dati dell'utente dal localStorage o sessionStorage
    try {
      const savedUser = localStorage.getItem('user') || 
                        sessionStorage.getItem('user') || 
                        localStorage.getItem('userData');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        currentUser = {
          username: parsed.username || parsed.catName || parsed.name || parsed.displayName || 'Anonimo',
          email: parsed.email || parsed.userEmail || 'N/D'
        };
      }
    } catch (e) {
      // Se non è in formato JSON o c'è un errore, prosegue con i dati di default
    }

    // Costruzione del pacchetto dati
    const payload = {
      user: currentUser.username,
      email: currentUser.email,
      page: window.location.pathname || 'index.html', // Es. /feed.html
      userAgent: navigator.userAgent,                // Info OS + Browser
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    // Invia i dati all'API di tracciamento
    fetch(`${NGROK_URL}/api/track`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true' // Evita la pagina di avviso di ngrok
      },
      body: JSON.stringify(payload)
    }).catch(err => {
      // Ignora silenziosamente gli errori di connessione quando il bot è spento
    });
  }

  // 1. Invia la segnalazione appena la pagina viene caricata
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    trackUserPresence();
  } else {
    document.addEventListener('DOMContentLoaded', trackUserPresence);
  }

  // 2. Invia un ping ogni 30 secondi per tracciare la presenza continua
  setInterval(trackUserPresence, 30000);
})();
