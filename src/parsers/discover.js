/**
 * Interpreta una trama de SIMCOM y carga el parser correspondiente. Las tramas
 * de simcom son cadenas de texto separadas por comas, el primer valor corresponde
 * al tipo de trama, que suele ser un valor númerico de 0 a 16. En el directorio
 * parsers existe un fichero para cada tipo de trama.
 *
 * Si una trama no tiene fichero
 *
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
module.exports = (app) => {
  const parsers = {
    '0': require([__dirname, '0.js'].join('/'))(app),
    '2': require([__dirname, '2.js'].join('/'))(app)
  }

  return (data) => {
    const trama = data.split('|')[1].split(',')

    switch (trama[0]) {
      case '0':
        return parsers[0]
      case '2':
        return parsers[2]
      default:
        return null
    }
  }
}
