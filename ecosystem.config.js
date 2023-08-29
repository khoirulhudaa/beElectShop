module.exports = {
  apps: [
    {
      name: 'huda-app',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/huda',
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
    },
  ],
};
