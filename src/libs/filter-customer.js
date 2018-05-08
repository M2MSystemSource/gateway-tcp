/**
 * Filtra los datos de la posición si fuera necesario
 * @type {Object}
 */


/**
 * Listado de dispositivos a filtrar, con el filtro que se les aplicará
 * @type {Object}
 */
const devicesToFilter = {
  vinRectifier: [
    // movus
    '867717036843176', '867717036807080', '867717036843663', '867717036804772',
    '867717036848837', '867717036804848', '867717036774850', '867717036809961',
    '867717036788538', '867717036851088', '867717036804202', '867717036774975',
    '867717036842202', '867717036851757', '867717036851179', '867717036851682',
    '867717036851781', '867717036797703', '867717036851740', '867717036843010',
    '867717036798214', '867717036797729', '867717036775238', '867717036799063',
    '867717036842541', '867717036851708', '867717036797802', '867717036797828',
    '867717036843879', '867717036797752', '867717036798099', '867717036851070',
    '867717036809979', '867717036804145', '867717036776806', '867717036850460',
    '867717036776814', '867717036848878', '867717036851732', '867717036843093',
    '867717036851096', '867717036807205', '867717036805159', '867717036825843',
    '867717036851187', '867717036851138', '867717036842277', '867717036810233',
    '867717036851690'
    // añade nuevos dispotivos después de este comentario
  ]
}

module.exports = (app) => {
  /**
   * Los filtros se presentan como métodos con el mismo nombre que alguna de
   * las opciones de devicesToFilter
   * @type {Object}
   */
  const filters = {
    /**
     * Rectifica el valor de la batería externa (position.data.extra) para
     * compensar el fallo en el firmware de estos dispositivos por el cual
     * se obtienen valores negativos en batería
     * @param  {Object} position Posición según modelo de datos en la Api
     * @return {Object}          Posición rectificada
     */
    vinRectifier: (position) => {
      const intLimit = 32767 // valor máximo del tipo de dato INT en chips de 8bits
      const vin = parseInt(position.data.extra, 10) // vIn original de la posición

      // si es negativo aplicamos fórmula para compensar el desbordamiento de
      // variable int en firmware
      if (vin < 0) {
        const x = vin + intLimit
        position.data.extra = x + intLimit

      // si es menor que 9000 indica un valor de lectura residual, lo dejamos a cero
      } else if (vin < 9000) {
        position.data.extra = 0
      }

      return position
    }
  }

  /**
   * Buscamos en devicesToFilter si el dispositivo tiene algún filtro asociado
   * y aplicamos el filtro
   * @param  {Object} device   Dispositivo según modelo de datos en la Api
   * @param  {Object} position Posición según modelo de datos en la Api
   * @return {Object}          Posición rectificada
   */
  return (device, position) => {
    Object.keys(devicesToFilter).forEach((filter) => {
      if (!filters.hasOwnProperty(filter)) return
      if (devicesToFilter[filter].indexOf(device._id) === -1) return
      position = filters[filter](position)
    })

    return position
  }
}
