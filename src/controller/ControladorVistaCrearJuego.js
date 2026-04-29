import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import { leaveCurrentRoom } from '../services/SmartFoxService.js'

export class ControladorVistaCrearJuego {
  constructor(vistaCrearJuego, estadoApp, controladorEstadoApp) {
    this.vistaCrearJuego = vistaCrearJuego
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaCrearJuego.onVolver(async () => {
      if (this.estadoApp.getLobbyActual()) {
        await leaveCurrentRoom()
        this.estadoApp.limpiarLobbyActual()
      }

      const pantallaRetorno =
        this.estadoApp.tipoJugador === TIPOS_JUGADOR.REGISTRADO
          ? PANTALLAS.INICIAL_REGISTRADO
          : PANTALLAS.INICIAL_PUBLICA

      this.controladorEstadoApp.irAPantalla(pantallaRetorno)
    })

    this.vistaCrearJuego.onEntrar(() => {
      const lobbyActual = this.estadoApp.getLobbyActual()

      if (!lobbyActual) {
        this.vistaCrearJuego.mostrarError('No hay una partida creada o un lobby unido')
        return
      }

      this.controladorEstadoApp.irAPantalla(PANTALLAS.PARTIDA)
    })
  }
}
