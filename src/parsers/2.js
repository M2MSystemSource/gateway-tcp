const assert = require('assert')

/*
  format: '2,101337.000,0039.5200,N,-0000.4541,W,1,8,1.43,94.0,3839'

  GGA          Global Positioning System Fix Data
  123519       Fix taken at 12:35:19 UTC
  4807.038     Latitude 48 deg 07.038'
  N            fot latitud
  01131.000    Longitude 11 deg 31.000'
  E            for longitude
  1            Fix quality: 0 = invalid
                           1 = GPS fix (SPS)
                           2 = DGPS fix
                           3 = PPS fix
         4 = Real Time Kinematic
         5 = Float RTK
                           6 = estimated (dead reckoning) (2.3 feature)
         7 = Manual input mode
         8 = Simulation mode
  08           Number of satellites being tracked
  0.9          Horizontal dilution of position
  545.4,M      Altitude, Meters, above mean sea level
  46.9,M       Height of geoid (mean sea level) above WGS84
                  ellipsoid
  (empty field) time in seconds since last DGPS update
  (empty field) DGPS station ID number
  *47          the checksum data, always begins with *

  //
  2
  143846.000
  0039.5199
  N
  -0000.4542
  W
  1
  14
  0.82
  85.

  //
  2
  000017.000
  0000.0000
  N
  00000.0000
  E
  0
  0
  0.0
  M
  0.

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

      assert.notEqual(null, data[1])
      assert.notEqual(null, data[2])
      assert.notEqual(null, data[3])
      assert.notEqual(null, data[4])
      assert.notEqual(null, data[5])
      assert.notEqual(null, data[6])
      assert.notEqual(null, data[7])
      assert.notEqual(null, data[8])
      assert.notEqual(null, data[9])

      // 6 fix quality; 7 number satelites; 8 hdop; 9 altitud
      const position = {
        _device: getDeviceId(trama[0]),
        gpstime: simcomTimeToTimestamp(data[1]),
        servertime: Date.now(),
        data: {
          accel: [0, 0, 0],
          alt: parseFloat(data[9]),
          battery: parseFloat(vbat),
          extbattery: parseFloat(vin),
          cog: -1,
          gps: data[8] || -1,
          gsm: -1,
          loc: [parseFloat(data[4]) || 0, parseFloat(data[2]) || 0],
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
