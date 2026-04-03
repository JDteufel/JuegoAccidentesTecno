import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'

export class ControladorVistaInicioSesion {
  constructor(vistaInicioSesion, estadoApp, controladorEstadoApp) {
    this.vistaInicioSesion = vistaInicioSesion
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaInicioSesion.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_PUBLICA)
    })

    this.vistaInicioSesion.onAccion(() => {
      this.estadoApp.setTipoJugador(TIPOS_JUGADOR.REGISTRADO)
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_REGISTRADO)
    })
  }
}
