var crc16 = require('crc16')

/**
 * @module messageParser
 */
module.exports = (app) => {
  const parser = (message) => {
    message = message.toString()
    if (!parser.isValid(message)) {
      return false
    }

    const messageParts = message.trim().split(';')

    // quitamos el crc
    messageParts.pop()

    const position = {
      _device: messageParts[0],
      gpstime: messageParts[1],
      servertime: Date.now(),
      data: {
        alt: parseInt(messageParts[5], 10),
        battery: parseFloat(messageParts[10]),
        extbattery: parseFloat(messageParts[11]),
        cog: parseInt(messageParts[6], 10),
        gps: parseInt(messageParts[9], 10),
        gsm: parseInt(messageParts[8], 10),
        loc: [parseFloat(messageParts[2]), parseFloat(messageParts[3])],
        speed: parseInt(messageParts[4], 10)
      }
    }

    return position
  }

  /**
   * Se verifican dos cosas: que la cantidad de parámetros del mensaje corresponda
   * con la definida (13) y que el cálculo del CRC sea válido.
   *
   * TODO: se comprueba el número de parámetros pero no su contenido
   *
   * @sync
   * @param  {String} message
   * @return {Boolean} true si el mensaje es válido
   */
  parser.isValid = (message) => {
    const messageParts = message.split(';')

    /*
     * La cantidad de parametros del mensaje siempre es un valor estático de
     * 13 propiedades (incluído el CRC). Esto está documentado en el manual
     * Arquitectura del Servicio de Tracking (TSA)
     */
    if (messageParts.length !== 13) {
      return false
    }

    /*
     * Verificamos CRC16
     */

    // extraemos crc original (último parámetro del mensaje)
    const originalCRC = parseInt(messageParts.pop())
    // juntamos la parte valida del mensaje para el calculo del crc
    // (mensaje original sin el crc)
    const calculateFrom = messageParts.join(';')
    // creamos nuestro crc, que deberá ser igual al extraído (originalCRC)
    const currentCRC = crc16(calculateFrom)

    if (originalCRC !== currentCRC) {
      return false
    }

    return true
  }

  return parser
}
