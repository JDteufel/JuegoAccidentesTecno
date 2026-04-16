import { PANTALLAS } from '../model/EstadoApp.js'

export class ControladorVistaAccidentes {
  constructor(vistaAccidentes, controladorEstadoApp) {
    this.vistaAccidentes = vistaAccidentes
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaAccidentes.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.REGLAS)
    })
  }
}
