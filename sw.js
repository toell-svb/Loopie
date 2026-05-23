const CACHE_NAME = 'loopie-pwa-v1';

// Alle Dateien, die für den Offline-Betrieb zwingend geladen werden müssen
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Hier deine Icon-Dateien eintragen, sobald sie im GitHub-Ordner liegen:
  './icon-192.png',
  './icon-512.png'
];

// 1. Service Worker installieren und alle Assets in den Cache laden
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Loopie-Cache wird aufgebaut...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Aktiviert den neuen Service Worker sofort
  );
});

// 2. Aktivierung: Alte Caches löschen, wenn du die App updatest (z.B. von v1 auf v2)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Alten Loopie-Cache gelöscht:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Übernimmt sofort die Kontrolle über alle offenen Tabs
  );
});

// 3. Netzwerk-Anfragen abfangen (Offline-First-Strategie)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Wenn die Datei im Cache ist, nutze sie sofort (wichtig für Offline-Modus)
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Ansonsten normal aus dem Internet laden
      return fetch(event.request).catch(() => {
        // Optionale Fehlerbehandlung, falls man offline ist und eine nicht-gecachete Datei aufruft
        console.log('Datei konnte nicht geladen werden (Offline & nicht im Cache):', event.request.url);
      });
    })
  );
});
