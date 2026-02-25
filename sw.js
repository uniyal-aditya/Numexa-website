const CACHE = 'numexa-shell-v1';
const FILES = [
    '/', '/index.html', '/css/style.css',
    '/js/app.js', '/js/calculator.js', '/js/plot.js', '/js/history.js', '/js/cursor.js',
    '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
    );
});
self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))
    );
});
