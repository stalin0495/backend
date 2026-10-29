// ecosystem.config.cjs
// Configuración de PM2: definición del proceso (apps) y del flujo de despliegue remoto (deploy)
module.exports = {
  apps: [
    {
      name: 'backend',
      script: './node_modules/.bin/tsx',
      args: 'src/index.ts',
      cwd: '/home/ubuntu/apps/backend/current',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: ['18.217.235.79'],
      key: 'C:/clave/bclaves2.pem',
      ref: 'origin/main',
      repo: 'https://github.com/stalin0495/backend.git',
      path: '/home/ubuntu/apps/backend',
      ssh_options: 'StrictHostKeyChecking=no',
      // El .env real vive en /home/ubuntu/apps/backend/shared/.env (fuera del repo) y se enlaza en cada release
      'post-deploy':
        'ln -sf /home/ubuntu/apps/backend/shared/.env /home/ubuntu/apps/backend/current/.env && ' +
        'npm install && ' +
        'pm2 startOrRestart ecosystem.config.cjs --only backend --env production',
    },
  },
};
