if (process.env.NODE_ENV !== 'production') {
  require('longjohn')
}

const gateway = require('./src/app')
module.exports = gateway
