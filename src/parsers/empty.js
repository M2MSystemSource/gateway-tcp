/**
 * Posiciones que no incluyen información de geolocalización, solo bateria
 */
module.exports = (app) => {
  const getDeviceId = (index) => {
    index = parseInt(index, 10)
    const ids = ['861510030805218']

    return ids[index] || index.toString()
  }

  return (data) => {
    const plot = data.split('|')

    const bat = plot[2].split(',')

    const vbat = bat[0] || 0
    const vin = bat[1] || 0

    return {
      _device: getDeviceId(plot[0]),
      gpstime: -1,
      servertime: Date.now(),
      data: {
        accel: [0, 0, 0],
        alt: 0,
        battery: parseFloat(vbat),
        extbattery: parseFloat(vin),
        cog: -1,
        gps: -1,
        gsm: -1,
        loc: [0, 0],
        speed: -1
      }
    }
  }
}
