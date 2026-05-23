const CACHE_NAME = 'loopie-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Sobald du deine Icons hochgeladen hast, kannst du sie hier ergänzen, 
  // z.B. './icon-192.png', './icon-512.png'
];

// Install-Event: Cacht alle oben genannten Dateien
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Fetch-Event: Lädt die App aus dem Cache, wenn kein Internet da ist
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
