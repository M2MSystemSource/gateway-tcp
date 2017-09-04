const net = require('net')

module.exports = (app) => {
  const server = net.createServer()
  server.on('connection', handleConnection)

  server.listen(process.env.PORT, function () {
    console.log('server listening to %j', server.address())
  })

  function preValidate (data) {
    const trama = data.split('|')
    if (trama.length !== 2) {
      return false
    }

    if (isNaN(trama[0])) {
      return false
    }

    return true
  }

  function handleConnection (conn) {
    const remoteAddress = conn.remoteAddress + ':' + conn.remotePort
    console.log('new client connection from %s', remoteAddress)

    conn.setEncoding('utf8')

    conn.on('data', onConnData)
    conn.once('close', onConnClose)
    conn.on('error', onConnError)

    function onConnData (data) {
      console.log('connection data from %s: %j', remoteAddress, data)

      if (!preValidate(data)) {
        conn.write('ko|prevalidation - missing device ID?')
        console.log('ko - prevalidation')
        return
      }

      // obtenemos el tipo de trama según notación de SIMCOM
      const parser = app.parserDiscover(data)
      if (!parser) {
        conn.write('ko|invalid plot')
        console.log('ko - invalid plot, no parser found')
        return
      }

      // utilizamos el parser para convertir la trama en una posición
      const position = parser(data)
      console.log('position', position)
      if (!position) {
        conn.write('ko|invalid position')
        console.log('ko - invalid position')
        return
      }

      app.legitimate(position, (err, position) => {
        console.log('33')
        if (err || !position) {
          console.log('44', err)
          console.log('55', position)
          // simplemente despreciamos la posición, pero se debería hacer algo,
          // por ejemplo informar al cliente vía mqtt de que su posición no
          // es válida (enviar un mensaje al canal personal del dispositivo)
          return app.debug('Position not legitimate %s', err)
        }

        // envia la posición a la Api de M2M
        app.sendPosition(position)

        // Envia la posición al servidor de watchers
        app.watcher.post(position)

        conn.write('ok')
      })
    }

    function onConnClose () {
      console.log('connection from %s closed', remoteAddress)
    }

    function onConnError (err) {
      console.log('Connection %s error: %s', remoteAddress, err.message)
    }
  }
}
