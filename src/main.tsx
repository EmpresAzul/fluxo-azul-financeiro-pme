
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos
    },
  },
});

// Enhanced PWA functionality with update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('FluxoAzul PWA: Service Worker registered successfully:', registration.scope);
        
        // Check for updates every 30 seconds in development
        if (process.env.NODE_ENV === 'development') {
          setInterval(() => {
            registration.update();
          }, 30000);
        }
        
        // Listen for new service worker installation
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('FluxoAzul PWA: New service worker found, installing...');
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('FluxoAzul PWA: New version available, prompting user...');
                // Show update notification
                if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
        
        // Listen for service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('FluxoAzul PWA: Service worker updated, reloading...');
          window.location.reload();
        });
        
        // Add cache management functions to window
        (window as any).clearPWACache = () => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
          }
        };
        
        (window as any).checkPWAVersion = () => {
          return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              resolve(event.data);
            };
            if (navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage(
                { type: 'GET_VERSION' }, 
                [messageChannel.port2]
              );
            }
          });
        };
        
      })
      .catch((error) => {
        console.log('FluxoAzul PWA: Service Worker registration failed:', error);
      });
  });
  
  // Listen for cache cleared message
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'CACHE_CLEARED') {
      console.log('FluxoAzul PWA: Cache cleared, reloading page...');
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
