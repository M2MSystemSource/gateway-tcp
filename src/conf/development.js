module.exports = {
  mongo: {
    uri: 'mongodb://localhost:27017/m2m'
  },

  api: {
    url: 'http://m2m.dev',
    username: 'admin',
    password: '123456',
    maxAttemptsFails: 10
  },

  watcher: {
    tracking: 'http://localhost:3010/tracking',
    sensing: 'http://localhost:3010/sensing',
    gwtcpDebug: 'http://localhost:5050/gwtcpDebug'
  }
}
