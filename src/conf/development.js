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

  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: '40b7a343fb9dfaa54cfd33a92119f7494d9f58be1e99c4e6c96bb06cf8714179'
  },

  watcher: {
    url: 'http://localhost:3010/tracking'
  }
}
