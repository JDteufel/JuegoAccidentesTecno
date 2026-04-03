import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'

export class ControladorVistaJugar {
  constructor(vistaJugar, estadoApp, controladorEstadoApp) {
    this.vistaJugar = vistaJugar
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaJugar.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_PUBLICA)
    })

    this.vistaJugar.onAccion(() => {
      this.estadoApp.setTipoJugador(TIPOS_JUGADOR.INVITADO)
      this.controladorEstadoApp.irAPantalla(PANTALLAS.GESTION_LOBBY)
    })
  }
}
