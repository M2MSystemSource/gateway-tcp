/**
 * Cada vez que se recibe una posición en algún topic se debe comprobar
 * que el dispositivo que la emite tiene permitido el acceso al servicio.
 *
 * Cada mensaje que se recibe contiene la id del dispositivo. Todos los dispositivos
 * están en mongo. Actualmente se realiza una consulta a la base de datos para
 * verificar que el dispositivo es válido, pero este modo de operar no es el más
 * óptimo, por ejemplo si un dispositivo emite una posición cada 10 segundos
 * entonces vamos a estar realizando verificaciones redundantes de forma continua,
 * lo cual es una perdida de tiempo y recursos. Se debe emplear algún sistema de caché,
 * bien sea en memoria con node o utilizando redis.
 *
 * @param {Object} data Position
 * @module  legitimate
 */
module.exports = (app) => {
  const legitimate = (data, callback) => {
    app.db.get('devices')
      .findOne(
        {_id: data._device, freeze: false},
        {_id: 1},
        (err, device) => {
          if (err || !device) return callback(err, null)
          callback(null, data)
        })
  }

  return legitimate
}
