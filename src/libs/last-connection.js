module.exports = (app) => {
  return function (position, device, cb = function () {}) {
    const now = Date.now()
    app.db.get('devices').updateOne(
      {_id: device._id},
      {$set: {
        'tracking.servertime': now,
        'tracking.data.battery': position.data.battery || -1
      }},
      function (err, device) {
        if (err) return console.log('err', err)
      }
    ) // updateOne
  }
}
