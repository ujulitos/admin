// Service Worker

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('airhorner').then(cache => {
            return cache.addAll([
                    '/',
                    '/index.html',
                    '/index.html?homescreen=1',
                    '/?homescreen=1',
                    '/inc/inicio.html',
                    '/inc/cursos.html',
                    '/inc/usuarios.html',
                    '/inc/sesiones.html',
                    '/css/estilos.css',
                    '/js/app.js',
                    '/images/curso2.jpg'
                ])
                .then(() => self.skipWaiting());
        })
    )
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
