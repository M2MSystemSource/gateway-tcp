const Client = require('node-rest-client').Client

module.exports = (app) => {
  /**
   * Utiliza la librería node-rest-client para hacer peticiones http.
   * @module api
   * @fires  api-ready
   * @see    https://github.com/aacerox/node-rest-client
   */
  const api = {}
  const conf = app.conf.api
  const auth = {user: conf.username, password: conf.password}
  const client = new Client(auth)

  /**
   * Wrapper para el método post de node-rest-client. La URL de este método
   * debe ser el endpoit de la Api de M2MSS. El host de la url se extrae
   * de la configuración ({@link module:conf})
   *
   * El parámetro `args` es opcional, en caso de no ofrecerse `cb` pasará a segundo
   * parámetro. `cb` es obligatorio y se ejecuta si devuelve una respuesta válida.
   *
   * @example
   * const client = require('api-client.js')
   * const req = client.post('/v1/tracking', (data, response) => {
   *   console.log(data)
   * })
   * req.on('error', errorHandler)
   *
   * @async
   * @memberof module:api
   * @param  {String}   url    Destino de la petición (solo end point, sin host)
   * @param  {Object}   [args] Argumentos según node-rest-client
   * @param  {Function} cb     Callback de node-rest-client. Ofrece parametros
   *   `data` y `response`
   * @return {Object}          Devuelve un objeto node-rest-client que se puede utilizar
   *   como error handler (ver ejemplo arriba)
   */
  api.post = (url, args, cb) => {
    url = app.conf.api.url + url
    if (!cb) {
      cb = args
      args = {}
    }

    return client.post(url, args, cb)
  }

  app.debug('API Ready')
  app.emit('api-ready')

  return api
}
