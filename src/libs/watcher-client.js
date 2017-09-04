const Client = require('node-rest-client').Client

module.exports = (app) => {
  /**
   * Utiliza la librería node-rest-client para hacer peticiones http.
   * @module api
   * @fires  api-ready
   * @see    https://github.com/aacerox/node-rest-client
   */
  const api = {}
  const client = new Client()

  /**
   */
  api.post = (position) => {
    const url = app.conf.watcher.url
    const data = JSON.stringify(position)

    try {
      client
        .post(url, {
          data,
          headers: {'Content-Type': 'application/text'}
        }, (data) => {
          data = data.toString()
          // watcher nos devuelve un "ok" si la solicitud es válida
          // cualquier otro valor se debería entender como un error.
          if (data !== 'ok') {
            app.debug('Watcher response error')
          }
        })
        .on('error', (err) => {
          console.log('err', err);
        })
    } catch (e) {
      console.log('e', e)
    }
  }

  app.debug('WATCHER CLIENT Ready')
  app.emit('watcher-ready')

  return api
}
