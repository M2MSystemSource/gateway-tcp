/**
 * @exports conf
 * @return {Object}
 */
module.exports = () => {
  return {
    redis: {
      server: '',
      port: '',
      password: ''
    },
    mqtt: {
      server: 'mqtt://localhost',
      connOptions: {
        clientId: 'gw01',
        clean: true,
        sessionPresent: true
      },
      clientOptions: {
        retain: false,
        qos: 2
      }
    }
  }
}
