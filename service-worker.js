
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('ae-inspector-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/record.html',
        '/report.html',
        '/detail.html',
        '/summary-report.html',
        '/style.css',
        '/app.js',
        '/icons/icon-192.png',
        '/icons/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
