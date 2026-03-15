/* ================================================================
   NUMEXA — sw.js | Service Worker
   Strategy:
   - HTML pages  → Network first, fallback to cache
   - CSS / JS    → Network first, fallback to cache
   - Images      → Cache first, fallback to network
   ================================================================ */

const CACHE_VERSION = 'numexa-v3';
const CACHE_ASSETS  = 'numexa-assets-v3';

const HTML_PAGES = [
  '/', '/index.html', '/playground.html', '/preview.html',
  '/features.html', '/docs.html', '/api.html',
  '/changelog.html', '/support.html', '/privacy.html', '/terms.html'
];

/* ── INSTALL: pre-cache all HTML pages ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(HTML_PAGES))
  );
  self.skipWaiting(); // activate immediately, don't wait for old SW to die
});

/* ── ACTIVATE: delete all old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_VERSION && k !== CACHE_ASSETS)
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim()) // take control of all open tabs immediately
  );
});

/* ── FETCH: intercept every request ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  const isHTML = request.headers.get('accept')?.includes('text/html')
    || url.pathname.endsWith('.html')
    || url.pathname === '/';

  const isAsset = url.pathname.match(/\.(png|jpg|jpeg|gif|webp|ico|svg|woff2?|ttf)$/i);

  if (isHTML) {
    // NETWORK FIRST for HTML — always try to get fresh page
    event.respondWith(networkFirst(request));
  } else if (isAsset) {
    // CACHE FIRST for images/fonts — serve from cache, update in background
    event.respondWith(cacheFirst(request, CACHE_ASSETS));
  } else {
    // NETWORK FIRST for CSS/JS — fresh code, fallback to cache
    event.respondWith(networkFirst(request));
  }
});

/* ── Network First: try network, fall back to cache ── */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request, { cache: 'no-store' });
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

/* ── Cache First: serve from cache, update in background ── */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    // Update in background
    fetch(request).then(async fresh => {
      if (fresh.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, fresh);
      }
    }).catch(() => {});
    return cached;
  }
  // Not in cache — fetch and store
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}
