// format: '861510030796102|2,101955.000,0039.5200,N,-0000.4542,W,1,14,0.85,96.\u001a'
/*
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
 */
module.exports = (app) => {
  function simcomTimeToTimestamp (time) {
    const now = new Date(Date.now())

    now.setHours(time.slice(0, 2))
    now.setMinutes(time.slice(2, 4))
    now.setSeconds(time.slice(4, 6))

    return now.getTime()
  }

  return (data) => {
    const t1 = data.split('|')

    try {
      const t2 = t1[1].split(',')
      // 6 fix quality; 7 number satelites; 8 hdop; 9 altitud, 10 high of geoid
      const position = {
        _device: t1[0],
        gpstime: simcomTimeToTimestamp(t2[1]),
        servertime: Date.now(),
        data: {
          accel: [0, 0, 0],
          alt: t2[9] || -1,
          battery: -1,
          cog: -1,
          extra: '',
          gps: t2[8] || -1,
          gsm: -1,
          loc: [parseFloat(t2[2]), parseFloat(t2[4])],
          speed: -1
        }
      }

      return position

    //
    } catch (err) {
      console.log('[ERR] parse trama, invalid format')
    }

    return null
  }
}
