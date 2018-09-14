module.exports = (app) => {
  return function (position, device, cb = function () {}) {
    const now = Date.now()

    const update = {
      'tracking.servertime': now
    }

    // En función de si hay GPS o no actualizaremos una cosa u otra.
    // Cuando no tenemos GPS solo actualizamos los datos de batería y la fecha
    // GPS se queda a -1, esto indicaría al cliente que la ultima posición solo
    // contiene datos de batería, por lo que la geolocalización representada
    // puede no ajustarse a la realidad.
    if (position.gpstime === -1) {
      // NO HAY POSICÓN - SOLO BATERÍA
      update['tracking.servertime'] = now
      update['tracking.data.battery'] = position.data.battery
      // para la batería externa inicialmente se utilizó el campo extra.
      // luego se añadió "extbattery" para darle entidad propia.
      // Se mantiene "extra" por retro-compatibilidad
      update['tracking.data.extra'] = position.data.extra
      update['tracking.data.extbattery'] = position.data.extra
      update['tracking.data.gps'] = 0
    } else {
      // POSICIóN y BATERÍA
      update['tracking.gpstime'] = position.gpstime
      update['tracking.servertime'] = now
      update['tracking.data'] = position.data
    }

    app.db.get('devices').updateOne(
      {_id: device._id},
      {$set: update},
      function (err, device) {
        if (err) return console.log('err', err)
      }
    ) // updateOne
  }
}
