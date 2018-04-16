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
    const plot = data.split('|')

    const trama = plot[1].split(',')
    const bat = plot[2].split(',')

    const vbat = bat[0] || 0
    const vin = bat[1] || 0

    return {
      _device: getDeviceId(plot[0]),
      gpstime: simcomTimeToTimestamp(trama[1]),
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
  }
}
