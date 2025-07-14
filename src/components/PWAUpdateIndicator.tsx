import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';

const PWAUpdateIndicator: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            setUpdateAvailable(true);
          });
        }
      });
    }
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
        toast.success('Cache limpo! A página será recarregada.');
      } else {
        // Fallback: clear browser cache
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      toast.error('Erro ao limpar cache. Tente recarregar a página.');
      window.location.reload();
    } finally {
      setIsClearing(false);
    }
  };

  const handleForceUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    } else {
      window.location.reload();
    }
  };

  // Show in development or when update is available
  const shouldShow = process.env.NODE_ENV === 'development' || updateAvailable;

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {updateAvailable && (
        <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-lg flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span className="text-sm">Nova versão disponível!</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleForceUpdate}
            className="ml-2"
          >
            Atualizar
          </Button>
        </div>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-secondary text-secondary-foreground p-2 rounded-lg shadow-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            disabled={isClearing}
            className="w-full flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isClearing ? 'animate-spin' : ''}`} />
            {isClearing ? 'Limpando...' : 'Limpar Cache'}
          </Button>
          <div className="text-xs text-muted-foreground mt-1 text-center">
            v3.0.0 - Dev Mode
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAUpdateIndicator;