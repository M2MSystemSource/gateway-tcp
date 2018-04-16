module.exports = (app) => {
  function formatSimcomDateTime (time) {
    var date = []
    date.push(time.slice(0, 4))
    date.push(time.slice(4, 6))
    date.push(time.slice(6, 8))
    date = date.join('-')

    var hour = []
    hour.push(time.slice(8, 10))
    hour.push(time.slice(10, 12))
    hour.push(time.slice(12, 14))
    hour = hour.join(':')

    return date + ' ' + hour
  }

  return (data) => {
    var result = null
    var err = '[ERR] parse trama, invalid format'

    try {
      var trama = {}

      var t1 = data.split('|')
      if (t1.length !== 2) {
        console.log(err)
        return null
      }

      trama.imei = t1[0]

      var t2 = t1[1].split(',')
      trama.type = t2[0]
      trama.lat = t2[1]
      trama.lon = t2[2]
      trama.alt = t2[3]
      trama.time = formatSimcomDateTime(t2[4])
      trama.ttff = t2[5]
      trama.num = t2[6]
      trama.speed = t2[7]
      trama.course = t2[8]
    } catch (err) {
      console.log(err)
      result = null
    }

    return result
  }
}
