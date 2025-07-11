const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">FluxoAzul</h1>
        <p className="text-gray-600 mb-6">Bem-vindo ao seu projeto conectado com Supabase!</p>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              ✅ Supabase conectado e configurado
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm text-green-700">
              🚀 Pronto para desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;