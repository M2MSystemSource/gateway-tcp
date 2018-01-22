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
    url: 'http://localhost:3010/tracking'
  }
}
