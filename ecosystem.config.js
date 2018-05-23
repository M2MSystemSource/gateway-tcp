module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [{
    name: 'gwtcp',
    script: '/var/m2m/gateway-tcp/source/app.js',
    restart_delay: 1000,
    instances: 0,
    max_restarts: 0,
    exec_mode: 'cluster',
    env: {
      PORT: 9000,
      DEBUG: 'gwtcp*',
      NODE_ENV: 'production'
    },
    env_production: {
      PORT: 9000,
      DEBUG: 'gwtcp*',
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: 'm2m',
      host: {
        host: '45.76.37.219',
        port: '2222'
      },
      ref: 'origin/master',
      repo: 'git@github.com:M2MSystemSource/gateway-tcp.git',
      path: '/var/m2m/gateway-tcp',
      'post-deploy': 'pm2 gracefulReload gwtcp --env production'
    }
  }
}
