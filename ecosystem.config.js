//ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'nodejs-careerhub-pm2',
      script: 'dist/main.js',
      instances: 0,
      exec_mode: 'cluster',
      // merge_logs: true,
      // autorestart: true,
      // watch: false,
    },
  ],
};
