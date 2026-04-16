import { PANTALLAS } from '../model/EstadoApp.js'

export class ControladorVistaCartas {
  constructor(vistaCartas, controladorEstadoApp) {
    this.vistaCartas = vistaCartas
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaCartas.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.REGLAS)
    })
  }
}