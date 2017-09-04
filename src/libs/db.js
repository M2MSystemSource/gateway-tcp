const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

module.exports = (app) => {
  let db = {conn: null}

  const url = app.conf.mongo.uri

  MongoClient.connect(url, (err, conn) => {
    assert.equal(null, err)
    db.conn = conn
    app.debug('Connected successfully to server')
    // conn.close()
  })

  db.get = (collection) => {
    if (db.conn) return db.conn.collection(collection)
  }

  return db
}
