import { PANTALLAS } from '../model/EstadoApp.js'

export class ControladorVistaReglas {
  constructor(vistaReglas, controladorEstadoApp) {
    this.vistaReglas = vistaReglas
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaReglas.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_PUBLICA)
    })

    this.vistaReglas.onVerCartas(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.CARTAS)
    })

    this.vistaReglas.onVerAccidentes(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.ACCIDENTES)
    })
  }
}