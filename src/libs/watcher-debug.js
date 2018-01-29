module.exports = (app) => {
  const socket = require('socket.io-client')(app.conf.watcher.gwtcpDebug)

  socket.on('connect', () => {
    console.log('msg1')
  })
  socket.on('event', () => {
    console.log('msg2')
  })

  app.remoteDebug = (data) => {
    socket.emit('debug', data)
  }
}
