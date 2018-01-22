const debug = require('debug')('gwtcp')

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

module.exports = function (app) {
  const incomeData = function (conn) {
    const remoteAddress = conn.remoteAddress + ':' + conn.remotePort

    const echo = function () {
      if (remoteAddress.indexOf(app.monitoringIp) === -1) {
        debug.apply(null, arguments)
      }
    }

    return function (data) {
      data = data.replace(',\u001a', '')
      echo('connection data from %s: %j', remoteAddress, data)

      if (!preValidate(data)) {
        conn.write('ko 001')
        echo('ko 001 - prevalidation')
        return
      }

      // obtenemos el tipo de trama según notación de SIMCOM
      const parser = app.parserDiscover(data)
      if (!parser) {
        conn.write('ko 002')
        echo('ko 002 - invalid plot, no parser found')
        return
      }

      // utilizamos el parser para convertir la trama en una posición
      const position = parser(data)

      app.legitimate(position, (err, position, device) => {
        if (device) {
          app.last(position, device)
        }

        if (err || !position) {
          // simplemente despreciamos la posición, pero se debería hacer algo,
          // por ejemplo informar al cliente vspotiía mqtt de que su posición no
          // es válida (enviar un mensaje al canal personal del dispositivo)
          conn.write('ko 003')
          return echo('ok 003 - Position not legitimate %s', err)
        }

        if (position.data.loc[0] === 0 && position.data.loc[1] === 0) {
          conn.write('ko 004')
          echo('ko 004 - invalid-location')
          return
        }

        // envia la posición a la Api de M2M
        app.sendPosition(position)

        // Envia la posición al servidor de watchers
        app.watcher.post(position)

        conn.write('okis')
      })
    }
  }

  return incomeData
}
