const path = require('path')
const EventEmitter = require('events')

class Gateway extends EventEmitter {
  constructor () {
    super()

    this.debug = require('debug')('gw')
    this.env = process.env.NODE_ENV || 'development'
    this.conf = require(path.join(__dirname, '/conf', this.env))

    this.db = require('./libs/db')(this)
    this.api = require('./libs/api-client')(this)
    this.watcher = require('./libs/watcher-client')(this)
    this.messageParser = require('./libs/message-parser')(this)
    this.sendPosition = require('./libs/send-position')(this)
    this.legitimate = require('./libs/legitimate')(this)
    this.tcp = require('./libs/tcp')(this)
    this.parserDiscover = require('./parsers/discover')(this)
  }
}

module.exports = new Gateway()
