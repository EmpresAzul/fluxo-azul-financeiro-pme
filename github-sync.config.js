/**
 * Configuração de sincronização GitHub para FluxoAzul
 * Este arquivo define as configurações para sincronização bidirecional com GitHub
 */

export const githubSyncConfig = {
  // Configurações do repositório
  repository: {
    name: 'fluxoazul',
    description: 'Sistema ERP completo com IA - FluxoAzul',
    private: false,
    autoInit: true,
    gitignoreTemplate: 'Node',
    licenseTemplate: 'mit'
  },

  // Configurações de branch
  branches: {
    main: 'main',
    development: 'development',
    autoCreateBranches: true
  },

  // Configurações de sincronização
  sync: {
    autoSync: true,
    syncInterval: 300000, // 5 minutos
    conflictResolution: 'lovable-wins', // 'github-wins' | 'lovable-wins' | 'manual'
    preserveFiles: [
      'README.md',
      'package.json',
      '.gitignore',
      'LICENSE'
    ]
  },

  // Configurações de deploy
  deploy: {
    autoDeployOnPush: true,
    buildCommand: 'npm run build',
    deployBranch: 'main',
    deployProvider: 'lovable' // 'vercel' | 'netlify' | 'lovable'
  },

  // Webhooks e integrações
  webhooks: {
    enabled: true,
    events: [
      'push',
      'pull_request',
      'release'
    ]
  },

  // Configurações de CI/CD
  cicd: {
    enabled: true,
    runTests: true,
    runLint: true,
    checkBuild: true
  }
};

export default githubSyncConfig;