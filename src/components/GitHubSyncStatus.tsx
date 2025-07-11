import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, RefreshCw, CheckCircle, AlertCircle, Github } from 'lucide-react';
import { githubSync, type SyncStatus } from '@/utils/githubSync';
import { toast } from 'sonner';

const GitHubSyncStatus: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSync: null,
    hasChanges: false,
    currentBranch: 'main'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStatus();
    
    // Inicializar o gerenciador de sincronização
    githubSync.initialize();
    
    // Cleanup
    return () => {
      githubSync.cleanup();
    };
  }, []);

  const loadStatus = async (): Promise<void> => {
    try {
      const currentStatus = await githubSync.getStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    }
  };

  const handleSync = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const success = await githubSync.forceSync();
      if (success) {
        toast.success('Sincronização concluída com sucesso!');
        await loadStatus();
      } else {
        toast.error('Erro durante a sincronização');
      }
    } catch (error) {
      toast.error('Erro durante a sincronização');
      console.error('Erro na sincronização:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastSync = (date: Date | null): string => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes}m atrás`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  const getStatusColor = (): "destructive" | "secondary" | "default" | "outline" => {
    if (!status.isConnected) return 'destructive';
    if (status.hasChanges) return 'secondary';
    return 'default';
  };

  const getStatusText = (): string => {
    if (!status.isConnected) return 'Desconectado';
    if (status.hasChanges) return 'Pendente';
    return 'Sincronizado';
  };

  const getStatusIcon = () => {
    if (!status.isConnected) return <AlertCircle className="h-4 w-4" />;
    if (status.hasChanges) return <RefreshCw className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Github className="h-4 w-4" />
          GitHub
        </CardTitle>
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <GitBranch className="h-3 w-3" />
              Branch:
            </span>
            <span className="font-mono">{status.currentBranch}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span>Última sincronização:</span>
            <span className="text-muted-foreground">
              {formatLastSync(status.lastSync)}
            </span>
          </div>
          
          {status.remoteUrl && (
            <div className="flex items-center justify-between text-sm">
              <span>Repositório:</span>
              <a 
                href={status.remoteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-xs truncate max-w-32"
              >
                {status.remoteUrl.split('/').slice(-2).join('/')}
              </a>
            </div>
          )}
          
          <Button 
            onClick={handleSync}
            disabled={isLoading || !status.isConnected}
            size="sm"
            className="w-full"
            variant={status.hasChanges ? "default" : "outline"}
          >
            <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubSyncStatus;