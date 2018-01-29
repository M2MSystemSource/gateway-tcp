const net = require('net')
const debug = require('debug')('gwtcp')

module.exports = (app) => {
  const server = net.createServer()
  server.on('connection', handleConnection)

  server.listen(process.env.PORT || 9000, function () {
    console.log('server listening to %j', server.address())
  })

  function handleConnection (socket) {
    const remoteAddress = socket.remoteAddress + ':' + socket.remotePort

    const echo = function () {
      if (remoteAddress.indexOf(app.monitoringIp) === -1) {
        debug.apply(null, arguments)
      }
    }

    echo('new client connection from %s', remoteAddress)

    socket.setEncoding('utf8')

    socket.once('close', onConnClose)
    socket.once('end', onConnEnd)
    socket.on('error', onConnError)

    // set timeout
    socket.setTimeout(3000)
    socket.on('timeout', () => {
      console.log('socket timeout')
      socket.write('timeout')
      socket.end()
    })

    function onConnClose () {
      echo('connection from %s closed', remoteAddress)
    }

    function onConnEnd () {
      echo('connection from %s ended', remoteAddress)
    }

    function onConnError (err) {
      echo('Connection %s error: %s', remoteAddress, err.message)
    }
  }
}
