const debug = require('debug')('gwtcp')

function preValidate (data) {
  const trama = data.split('|')
  if (trama.length !== 3) {
    return false
  }

  const bat = trama[2].split(',')
  if (bat.length !== 2) {
    return false
  }

  if (isNaN(trama[0])) {
    return false
  }

  return true
}

module.exports = function (app) {
  const incomeData = function (socket) {
    const remoteAddress = socket.remoteAddress + ':' + socket.remotePort

    function echo (str, ...args) {
      if (remoteAddress.indexOf(app.monitoringIp) > -1) return

      const strFormatted = str
        .split('%s')
        .reduce((aggregate, chunk, i) => aggregate + chunk + (args[i] || ''), '')

      app.remoteDebug(strFormatted)
      debug(strFormatted)
    }

    return function (data) {
      data = data.replace(',\u001a', '')
      echo('connection data from %s: %s', remoteAddress, data)

      if (!preValidate(data)) {
        socket.write('ko 001')
        echo('ko 001 - prevalidation')
        return
      }

      // obtenemos el tipo de trama según notación de SIMCOM
      const parser = app.parserDiscover(data)
      if (!parser) {
        socket.write('ko 002')
        echo('ko 002 - invalid plot, no parser found')
        return
      }

      // utilizamos el parser para convertir la trama en una posición
      const position = parser(data)

      app.legitimate(position, (err, position, device) => {
        if (!device) {
          socket.write('ko 004')
          echo('ko 004 - invalid-location')
          return
        }

        app.last(position, device)

        if (err || !position) {
          // simplemente despreciamos la posición, pero se debería hacer algo,
          // por ejemplo informar al cliente vspotiía mqtt de que su posición no
          // es válida (enviar un mensaje al canal personal del dispositivo)
          socket.write('ko 003')
          return echo('ko 003 - Position not legitimate %s', err)
        }

        if (position.data.loc[0] === 0 && position.data.loc[1] === 0) {
          socket.write('ko 004')
          echo('ko 004 - invalid-location')
          return
        }

        // la posicion es válida, la filtramos si fuera necesario
        position = app.filterPosition(device, position)

        // envia la posición a la Api de M2M
        app.sendPosition(position)

        // Envia la posición al servidor de watchers
        app.watcher.post(position)

        socket.write('okis')
      })
    }
  }

  return incomeData
}
