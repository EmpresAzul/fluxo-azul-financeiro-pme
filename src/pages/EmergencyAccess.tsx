import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Home, LogIn, AlertTriangle } from 'lucide-react';

const EmergencyAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600 p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-xl shadow-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso de Emergência
            </h1>
            <p className="text-gray-600">
              Sistema FluxoAzul - Página de recuperação
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Ir para Login</span>
            </Button>

            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Tentar Dashboard</span>
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            <p>Se você continua tendo problemas de acesso:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• Limpe o cache do navegador</li>
              <li>• Tente em uma aba anônima</li>
              <li>• Verifique sua conexão</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmergencyAccess;