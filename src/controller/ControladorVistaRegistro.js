import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'

export class ControladorVistaRegistro {
  constructor(vistaRegistro, estadoApp, controladorEstadoApp) {
    this.vistaRegistro = vistaRegistro
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaRegistro.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_PUBLICA)
    })

    this.vistaRegistro.onAccion(() => {
      this.estadoApp.setTipoJugador(TIPOS_JUGADOR.REGISTRADO)
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_REGISTRADO)
    })
  }
}
