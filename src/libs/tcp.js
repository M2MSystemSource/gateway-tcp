const net = require('net')
const debug = require('debug')('gwtcp')

module.exports = (app) => {
  const server = net.createServer()
  server.on('connection', handleConnection)

  server.listen(process.env.PORT || 9000, function () {
    console.log('server listening to %j', server.address())
  })

  function handleConnection (conn) {
    const remoteAddress = conn.remoteAddress + ':' + conn.remotePort

    const echo = function () {
      if (remoteAddress.indexOf(app.monitoringIp) === -1) {
        debug.apply(null, arguments)
      }
    }

    echo('new client connection from %s', remoteAddress)

    conn.setEncoding('utf8')

    conn.on('data', app.incomeData(conn))
    conn.once('close', onConnClose)
    conn.once('end', onConnEnd)
    conn.on('error', onConnError)

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
