import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'

export class ControladorVistaCrearJuego {
  constructor(vistaCrearJuego, estadoApp, controladorEstadoApp) {
    this.vistaCrearJuego = vistaCrearJuego
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaCrearJuego.onVolver(() => {
      const pantallaRetorno =
        this.estadoApp.tipoJugador === TIPOS_JUGADOR.REGISTRADO
          ? PANTALLAS.INICIAL_REGISTRADO
          : PANTALLAS.INICIAL_PUBLICA

      this.controladorEstadoApp.irAPantalla(pantallaRetorno)
    })

    this.vistaCrearJuego.onEntrar(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.PARTIDA)
    })
  }
}
