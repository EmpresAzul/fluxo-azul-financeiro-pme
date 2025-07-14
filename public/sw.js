
const CACHE_NAME = 'fluxoazul-v3.0.0';
const APP_VERSION = '3.0.0';
const urlsToCache = [
  '/',
  '/dashboard',
  '/lancamentos',
  '/fluxo-caixa',
  '/dre',
  '/precificacao',
  '/estoque',
  '/cadastros',
  '/saldos-bancarios',
  '/lembretes',
  '/pipeline',
  '/ponto-equilibrio',
  '/suporte',
  '/manifest.json',
  '/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png',
  '/lovable-uploads/b004bf2a-e9b1-4f11-87da-28e15f0cb2e2.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('FluxoAzul PWA: Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('FluxoAzul PWA: Cache opened successfully');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('FluxoAzul PWA: All resources cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('FluxoAzul PWA: Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('FluxoAzul PWA: Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('FluxoAzul PWA: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('FluxoAzul PWA: Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - development-friendly caching strategy
self.addEventListener('fetch', (event) => {
  // Skip caching for development hot-reload files
  if (event.request.url.includes('vite') || 
      event.request.url.includes('@fs') ||
      event.request.url.includes('?t=') ||
      event.request.url.includes('.tsx') ||
      event.request.url.includes('.ts') ||
      event.request.url.includes('.jsx') ||
      event.request.url.includes('.js')) {
    console.log('FluxoAzul PWA: Bypassing cache for development file:', event.request.url);
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // For static assets, use cache but verify freshness
        if (response) {
          console.log('FluxoAzul PWA: Serving from cache:', event.request.url);
          
          // For API calls and main pages, always try to fetch fresh data
          if (event.request.url.includes('/api/') || 
              event.request.url.includes('supabase') ||
              event.request.mode === 'navigate') {
            fetch(event.request)
              .then((freshResponse) => {
                if (freshResponse.ok) {
                  const responseClone = freshResponse.clone();
                  caches.open(CACHE_NAME)
                    .then((cache) => {
                      cache.put(event.request, responseClone);
                      console.log('FluxoAzul PWA: Updated cache for:', event.request.url);
                    });
                }
              })
              .catch(() => {
                console.log('FluxoAzul PWA: Background update failed, serving cached version');
              });
          }
          return response;
        }
        
        // Fetch from network
        console.log('FluxoAzul PWA: Fetching fresh from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('FluxoAzul PWA: Invalid response, not caching:', response?.status);
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('FluxoAzul PWA: Cached fresh response for:', event.request.url);
              });
            
            return response;
          })
          .catch((error) => {
            console.log('FluxoAzul PWA: Network fetch failed:', error);
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            // Return empty response for other requests
            return new Response('', { status: 404 });
          });
      })
  );
});

// Background sync for when connectivity is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('FluxoAzul PWA: Background sync triggered');
    event.waitUntil(
      // Here you could sync any pending data when connectivity is restored
      syncPendingData()
    );
  }
});

async function syncPendingData() {
  try {
    // Implementation for syncing pending data
    console.log('FluxoAzul PWA: Syncing pending data...');
    // This would sync any pending financial transactions, etc.
  } catch (error) {
    console.error('FluxoAzul PWA: Background sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png',
      badge: '/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('FluxoAzul', options)
    );
  }
});

// Version check message handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: APP_VERSION,
      cacheName: CACHE_NAME
    });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('FluxoAzul PWA: Forcing service worker update');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('FluxoAzul PWA: Clearing all caches');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('FluxoAzul PWA: Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('FluxoAzul PWA: All caches cleared');
        // Force reload after clearing cache
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'CACHE_CLEARED' });
          });
        });
      })
    );
  }
});
