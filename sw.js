// Pourr offline cache: the app opens instantly and works on a hotspot with no internet.
// Bump VERSION whenever any file below changes.
const VERSION = 'pourr-v5';
const FILES = ['./', 'index.html', 'privacy.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'lib/qrcode.min.js', 'lib/jsQR.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // Pages: try the network for the newest version, fall back to the cached copy when offline.
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  // Everything else: cache first, it never changes within a version.
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
