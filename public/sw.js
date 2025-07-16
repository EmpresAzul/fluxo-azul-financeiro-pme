
// Service Worker para PWA - Versão de emergência para resolver cache
const CACHE_NAME = 'fluxoazul-pwa-v4.0.0';
const APP_VERSION = '4.0.0';
const FORCE_CACHE_CLEAR = true;
const urlsToCache = [
  '/',
  '/login',
  '/emergency',
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

// Install event - FORCE CACHE CLEAR v4.0.0
self.addEventListener('install', (event) => {
  console.log('🚀 FluxoAzul PWA v4.0.0: EMERGENCY INSTALL - Force clearing ALL caches');
  event.waitUntil(
    Promise.all([
      // Limpar TODOS os caches existentes primeiro
      caches.keys().then(cacheNames => {
        console.log('🧹 Found', cacheNames.length, 'existing caches, deleting ALL...');
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('❌ Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Aguardar um pouco para garantir limpeza
      new Promise(resolve => setTimeout(resolve, 500))
    ]).then(() => {
      // Agora criar o cache novo
      return caches.open(CACHE_NAME);
    }).then(cache => {
      console.log('✅ New cache v4.0.0 created');
      return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => {
      console.log('✅ FluxoAzul PWA v4.0.0: All resources cached fresh');
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ FluxoAzul PWA v4.0.0: Installation failed:', error);
    })
  );
});

// Activate event - TOTAL CLEANUP v4.0.0
self.addEventListener('activate', (event) => {
  console.log('🔥 FluxoAzul PWA v4.0.0: EMERGENCY ACTIVATION - Total cleanup');
  event.waitUntil(
    Promise.all([
      // Garantir que TODOS os caches sejam removidos
      caches.keys().then((cacheNames) => {
        console.log('🧹 Activate: Found', cacheNames.length, 'caches to delete');
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('❌ Activate: Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Aguardar para garantir limpeza
      new Promise(resolve => setTimeout(resolve, 1000))
    ]).then(() => {
      // Recriar apenas o cache atual
      return caches.open(CACHE_NAME);
    }).then(cache => {
      return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => {
      console.log('✅ FluxoAzul PWA v4.0.0: Activated with fresh cache');
      // Notificar todas as abas para forçar reload
      return self.clients.matchAll().then(clients => {
        console.log('📢 Notifying', clients.length, 'clients to reload');
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_CLEARED',
            version: APP_VERSION,
            action: 'FORCE_RELOAD'
          });
        });
        return self.clients.claim();
      });
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
