import { PANTALLAS } from '../model/EstadoApp.js'
import mongoDBService from '../services/MongoDBService.js'

export class ControladorVistaEncuesta {
  constructor(vistaEncuesta, controladorEstadoApp) {
    this.vistaEncuesta = vistaEncuesta
    this.controladorEstadoApp = controladorEstadoApp
    this.username = null
    this.lobbyCode = null
  }

  init() {
    this.vistaEncuesta.onEnviar((respuestas) => {
      this.enviarEncuesta(respuestas)
    })

    this.vistaEncuesta.onCerrar(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_PUBLICA)
    })
  }

  configurarUsuario(username, lobbyCode) {
    this.username = username
    this.lobbyCode = lobbyCode
  }

  async enviarEncuesta(respuestas) {
    const datosEncuesta = {
      username: this.username || 'anonimo',
      lobbyCode: this.lobbyCode || 'N/A',
      respuestas,
      promedioGeneral: this._calcularPromedio(respuestas),
      timestamp: new Date().toISOString()
    }

    console.log('[ControladorVistaEncuesta] Enviando encuesta:', JSON.stringify(datosEncuesta, null, 2))

    try {
      const resultado = await mongoDBService.submitEncuesta(datosEncuesta)
      console.log('[ControladorVistaEncuesta] Respuesta del servidor:', JSON.stringify(resultado, null, 2))

      if (resultado && resultado.ok === true) {
        this.vistaEncuesta._mostrarFeedback('Encuesta enviada correctamente', 'success')
        setTimeout(() => {
          this.vistaEncuesta.ocultar()
          this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_PUBLICA)
        }, 1500)
      } else {
        console.error('[ControladorVistaEncuesta] Error del servidor:', resultado)
        this.vistaEncuesta._mostrarFeedback('Error al enviar la encuesta', 'warning')
      }
    } catch (error) {
      console.error('[ControladorVistaEncuesta] Error al enviar:', error)
      this.vistaEncuesta._mostrarFeedback('Error de conexión al enviar la encuesta', 'warning')
    }
  }

  _calcularPromedio(respuestas) {
    const valores = Object.values(respuestas)
    if (valores.length === 0) return 0
    const suma = valores.reduce((acc, val) => acc + val, 0)
    return Math.round((suma / valores.length) * 100) / 100
  }

  mostrar() {
    this.vistaEncuesta.resetear()
    this.vistaEncuesta.mostrar()
  }
}
