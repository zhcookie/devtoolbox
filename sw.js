const CACHE = 'devtools-v1';
const ASSETS = [
  '/',
  '/style.css',
  '/script.js',
  '/tools/json-formatter',
  '/tools/base64',
  '/tools/url-encode',
  '/tools/unicode',
  '/tools/html-entity',
  '/tools/markdown-preview',
  '/tools/regex-tester',
  '/tools/text-diff',
  '/tools/word-count',
  '/tools/lorem-ipsum',
  '/tools/csv-json',
  '/tools/jwt-decoder',
  '/tools/url-parser',
  '/tools/cron-parser',
  '/tools/qrcode-gen',
  '/tools/uuid-gen',
  '/tools/password-gen',
  '/tools/palette-gen',
  '/tools/image-compress',
  '/tools/image-to-base64',
  '/tools/color-picker',
  '/tools/timestamp',
  '/tools/number-base',
  '/tools/unit-converter',
  '/tools/pdf-merge',
  '/tools/file-hash',
  '/privacy',
  '/terms',
  '/about'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(res => {
        if (res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
