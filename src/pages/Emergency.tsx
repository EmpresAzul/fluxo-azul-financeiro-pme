import React from 'react';

const Emergency: React.FC = () => {
  const handleClearAll = () => {
    try {
      // Limpar todo o storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Limpar todos os caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      // Desregistrar service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
          });
        });
      }
      
      alert('✅ Cache e dados limpos! A página será recarregada.');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      alert('❌ Erro ao limpar dados. Tente fechar e reabrir o navegador.');
    }
  };

  const handleForceReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          🚨 Página de Emergência
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Se a aplicação não está carregando corretamente, use as opções abaixo para resolver o problema.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleForceReload}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            🔄 Recarregar Página
          </button>
          
          <button
            onClick={handleClearAll}
            className="w-full px-4 py-3 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
          >
            🧹 Limpar Cache e Dados
          </button>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Acesso direto:
            </p>
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm"
            >
              Ir para Login
            </a>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground">
            <strong>FluxoAzul v4.0.0</strong><br/>
            Sistema de Recuperação de Emergência
          </p>
        </div>
      </div>
    </div>
  );
};

export default Emergency;