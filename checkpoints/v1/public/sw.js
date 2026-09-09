// Simbion Film High-Performance Asset & 3D Frame Caching Service Worker (100% Free)
const CACHE_NAME = 'simbion-cache-v1';

// Static core assets to pre-cache immediately on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/src/simbionApp.js',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('[SW] Pre-cache warning:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests and Firebase / API calls
    if (event.request.method !== 'GET' || url.pathname.includes('firestore') || url.pathname.includes('firebase')) {
        return;
    }

    // 1. Cache-First for 3D Glass Sequence Frames & Heavy Media (Supabase, WebP, PNG, JPG, GIF, WebM, MP4, Woff2)
    const is3DFrame = url.href.includes('3d%20glass') || url.href.includes('ezgif-frame');
    const isMediaAsset = /\.(webp|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|mp3|mp4|webm)$/i.test(url.pathname);

    if (is3DFrame || isMediaAsset) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(event.request).then((networkResponse) => {
                        // Cache valid responses or opaque cross-origin responses
                        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Return empty fallback if network fails
                        return new Response('', { status: 408, statusText: 'Request Timed Out' });
                    });
                });
            })
        );
        return;
    }

    // 2. Stale-While-Revalidate for HTML, JS, CSS, CDN scripts
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            });
        })
    );
});
