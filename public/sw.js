// GameBet PWA Service Worker
// Implements cache-first strategy with offline fallback

const CACHE_VERSION = 'gamebet-v1';
const CACHE_NAME = `${CACHE_VERSION}-assets`;
const OFFLINE_CACHE = `${CACHE_VERSION}-offline`;

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// Offline fallback HTML
const OFFLINE_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - GameBet</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #071026 0%, #0a1628 100%);
      color: #fff;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 400px;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #06b6d4;
    }
    p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #cbd5e1;
      margin-bottom: 1.5rem;
    }
    button {
      background: #06b6d4;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      color: #071026;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover {
      transform: scale(1.05);
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🎮</div>
    <h1>You're Offline</h1>
    <p>GameBet requires an internet connection. Please check your connection and try again.</p>
    <button onclick="window.location.reload()">Retry</button>
  </div>
</body>
</html>
`;

// Install event - precache assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache precache assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS).catch((error) => {
          console.error('[Service Worker] Precache failed:', error);
          // Don't fail installation if precache fails
        });
      }),
      // Cache offline page
      caches.open(OFFLINE_CACHE).then((cache) => {
        return cache.put('/offline.html', new Response(OFFLINE_PAGE, {
          headers: { 'Content-Type': 'text/html' }
        }));
      })
    ]).then(() => {
      console.log('[Service Worker] Installed successfully');
      // Activate immediately
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Remove caches that don't match current version
            return cacheName.startsWith('gamebet-') && 
                   cacheName !== CACHE_NAME && 
                   cacheName !== OFFLINE_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[Service Worker] Activated successfully');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - cache-first strategy with offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Try cache first
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // Return offline page as fallback
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }
  
  // Cache-first strategy for other requests
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Return cached response and update cache in background
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Network failed, but we have cache
            return cached;
          });
        
        return cached;
      }
      
      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch((error) => {
          console.error('[Service Worker] Fetch failed:', error);
          throw error;
        });
    })
  );
});

// Message event handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        console.log('[Service Worker] All caches cleared');
      })
    );
  }
});
