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
    conn.once('end', onConnEnd)
    conn.on('error', onConnError)

    function onConnData (data) {
      data = data.replace(',\u001a', '')
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
      if (!position || typeof position === 'string') {
        let text = position || 'invalid position'
        conn.write('ko|' + text)
        console.log('ko - ' + text)
        return
      }

      if (position.data.loc[0] === 0 && position.data.loc[1] === 0) {
        let text = 'ko|invalid-location'
        conn.write(text)
        console.log(text)
        return
      }

      app.legitimate(position, (err, position) => {
        if (err || !position) {
          // simplemente despreciamos la posición, pero se debería hacer algo,
          // por ejemplo informar al cliente vía mqtt de que su posición no
          // es válida (enviar un mensaje al canal personal del dispositivo)
          return app.debug('Position not legitimate %s', err)
        }

        // envia la posición a la Api de M2M
        app.sendPosition(position)

        // Envia la posición al servidor de watchers
        app.watcher.post(position)

        conn.write('okis')
      })
    }

    function onConnClose () {
      console.log('connection from %s closed', remoteAddress)
    }

    function onConnEnd () {
      console.log('connection from %s ended', remoteAddress)
    }

    function onConnError (err) {
      console.log('Connection %s error: %s', remoteAddress, err.message)
    }
  }
}
