import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import { leaveCurrentRoom, subscribeToLobbyUpdates, getCurrentLobbyState } from '../services/SmartFoxService.js'

export class ControladorVistaCrearJuego {
  constructor(vistaCrearJuego, estadoApp, controladorEstadoApp) {
    this.vistaCrearJuego = vistaCrearJuego
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
    this.unsubscribeLobbyUpdates = null
  }

  init() {

    const lobbyActual = this.estadoApp.getLobbyActual()
    if (lobbyActual) {
      this.vistaCrearJuego.actualizarLobby(lobbyActual)
    }

    this.unsubscribeLobbyUpdates = subscribeToLobbyUpdates((lobbyData) => {
      console.log('[ControladorVistaCrearJuego] Actualización de lobby:', lobbyData)

      if (lobbyData) {

        const senderName = this.estadoApp.getLobbySenderName()
        const playerName = this.estadoApp.getLobbyPlayerName()
        this.estadoApp.setLobbyActual(lobbyData, senderName, playerName)

        this.vistaCrearJuego.actualizarLobby(lobbyData)
      } else {

        this.vistaCrearJuego.actualizarLobby(null)
      }
    })

    this.vistaCrearJuego.onVolver(async () => {

      if (this.unsubscribeLobbyUpdates) {
        this.unsubscribeLobbyUpdates()
        this.unsubscribeLobbyUpdates = null
      }

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
  }
}
