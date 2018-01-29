const path = require('path')
const EventEmitter = require('events')

class Gateway extends EventEmitter {
  constructor () {
    super()

    this.debug = require('debug')('gwtpc')
    this.env = process.env.NODE_ENV || 'development'
    this.conf = require(path.join(__dirname, '/conf', this.env))

    this.db = require('./libs/db')(this)
    this.api = require('./libs/api-client')(this)
    this.watcher = require('./libs/watcher-client')(this)
    this.watcherdebug = require('./libs/watcher-debug')(this)
    this.messageParser = require('./libs/message-parser')(this)
    this.sendPosition = require('./libs/send-position')(this)
    this.incomeData = require('./libs/income-data')(this)
    this.legitimate = require('./libs/legitimate')(this)
    this.last = require('./libs/last-connection')(this)
    this.tcp = require('./libs/tcp')(this)
    this.parserDiscover = require('./parsers/discover')(this)

    // la ip del servidor de monitoreo para excluir los pings de los logs
    this.monitoringIp = '83.56.185.173'
  }
}

module.exports = new Gateway()
