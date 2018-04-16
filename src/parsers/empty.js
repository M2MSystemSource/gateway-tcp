/**
 * Posiciones que no incluyen información de geolocalización, solo bateria
 */
module.exports = (app) => {
  const getDeviceId = (index) => {
    index = parseInt(index, 10)
    const ids = ['861510030805218']

    return ids[index] || index.toString()
  }

  function simcomTimeToTimestamp (time) {
    const now = new Date(Date.now())

    now.setHours(time.slice(0, 2))
    now.setMinutes(time.slice(2, 4))
    now.setSeconds(time.slice(4, 6))

    return now.getTime()
  }

  return (data) => {
    const trama = data.split('|')

    try {
      const data = trama[1].split(',')
      const bat = trama[2].split(',')

      const vbat = bat[0] || 0
      const vin = bat[1] || 0

      // 6 fix quality; 7 number satelites; 8 hdop; 9 altitud
      const position = {
        _device: getDeviceId(trama[0]),
        gpstime: simcomTimeToTimestamp(data[1]),
        servertime: Date.now(),
        data: {
          accel: [0, 0, 0],
          alt: 0,
          battery: parseFloat(vbat),
          cog: -1,
          extra: parseFloat(vin),
          gps: -1,
          gsm: -1,
          loc: [0, 0],
          speed: -1
        }
      }

      return position

    //
    } catch (err) {
      console.log('[ERR] parse trama, invalid format', err)
    }

    return null
  }
}
