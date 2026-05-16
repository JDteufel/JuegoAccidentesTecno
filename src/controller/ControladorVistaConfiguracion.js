import { PANTALLAS } from '../model/EstadoApp.js'
import temaService from '../services/TemaService.js'

export class ControladorVistaConfiguracion {
  constructor(vistaConfiguracion, controladorEstadoApp) {
    this.vistaConfiguracion = vistaConfiguracion
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaConfiguracion.onCerrar(() => {
      this.controladorEstadoApp.regresarPantallaAnterior()
    })

    this.vistaConfiguracion.onCambiarTema(async (temaId) => {
      await temaService.cambiarTema(temaId)
      this.controladorEstadoApp.aplicarTemaActual()
      this.controladorEstadoApp.regresarPantallaAnterior()
    })
  }
}
