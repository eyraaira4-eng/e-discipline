self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('e-discipline-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/assets/logo.png',     // <-- semua file sebenar awak
        '/assets/lego-bg.png'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
