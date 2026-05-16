import { PANTALLAS } from '../model/EstadoApp.js'

export class ControladorVistaReglas {
  constructor(vistaReglas, controladorEstadoApp) {
    this.vistaReglas = vistaReglas
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaReglas.onVolver(() => {
      const destino = this.controladorEstadoApp.estadoApp.getUsername()
        ? PANTALLAS.INICIAL_GAMEMASTER
        : PANTALLAS.INICIAL_PUBLICA
      this.controladorEstadoApp.irAPantalla(destino)
    })

    this.vistaReglas.onVerCartas(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.CARTAS)
    })

    this.vistaReglas.onVerAccidentes(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.ACCIDENTES)
    })
  }
}
