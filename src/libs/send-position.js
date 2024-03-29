const async = require('neo-async')

module.exports = (app) => {
  /**
   * Envía una posición a la API de M2MSS. Se utiliza async.queue para crear
   * una cola de trabajo.
   *
   * Los trackers envían posiciones al servidor (libs/tcp.js) y este,
   * tras validarla, nos lo envía aquí. Cada mensaje que entra se añade a la
   * cola de trabajo (q.push). La cola ejecuta un mensaje tras otro, en orden.
   *
   * Dentro de la cola los mensajes se envia a la api utilizando el cliente http
   * {@link module:api}. Cuando se realiza un envío se verifica que la respuesta
   * del servidor es válida, entonces se procede con el siguiente de la cola.
   *
   * Si la api no acepta la petición se volverá a reenviar sin pasar a la siguiente.
   * Mientras tanto se seguirán recibiendo posiciones del tracker que se irán añadiendo
   * a la cola a la espera de que salga la posición encallada. Si el servidor de Apis
   * está caído, el límite de mensajes que podrá alojar la cola de trabajo dependerá
   * de la memoría ram de que disponga el servidor.
   *
   * module  send-position
   * @param  {Object} position Position
   */
  const sendPosition = function (position) {
    q.push(position)
  }

  /**
   * Almacena la fecha de la ultima posición recibida. Cuando se recibe una nueva
   * se verifica que la fecha sea superior a la anterior, en caso negativo indicaría
   * que el tracker (o el agente externo que envía las posiciones a este servidor)
   * nos está enviando las posiciones de forma desordenada (las más nuevas antes
   * que las más viejas). A efectos poco podemos hacer más que almacenar un error
   * en algun sitio (cosa que no se hace) para alertar al responsable del firmware
   * del tracker de que algo no va bien.
   */
  let lastTime

  var q = async.queue((position, next) => {
    let sendAttemtps = 0
    const send = () => {
      // intentos de envío fallidos
      sendAttemtps++

      if (sendAttemtps > app.conf.maxAttemptsFails) {
        // la api de M2MSS está caída desde hace más de X intentos ¿que hacemos?
        // Se debe enviar notificación a algún canal
      }

      const args = {
        data: position,
        headers: {'Content-Type': 'application/json'}
      }

      if (lastTime) {
        if (position.gpstime < lastTime) {
          app.debug('maaaaal!', position.gpstime, lastTime)
        }
      }

      lastTime = position.time

      const req = app.api.post('/v1/tracking/position', args, (data, response) => {
        if (response.statusCode !== 200) {
          // respuesta inválida, volvemos a enviar
          app.debug('api response fail')
          setTimeout(send, 1000)
          return
        }
        // posición enviada, pasamos a la siguiente
        app.debug('sent', args.data)
        next()
      })

      // si hay un error volvemos a realizar el envío despues de 1 segundo
      req.on('error', (err) => {
        app.debug('err %s', err)
        console.log('app', err)
        setTimeout(send, 1000)
      })
    }

    send()
  })

  // assign a callback
  q.drain = () => {
    app.debug('all positions sent')
  }

  return sendPosition
}
