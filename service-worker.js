
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('ae-inspector-cache-v1').then(cache => {
      return cache.addAll([
        'index.html',
        'style.css',
        'record.html',
        'report.html',
        'summary-report.html',
        'icon.png',
        'manifest.json'
      ]);
    })
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
