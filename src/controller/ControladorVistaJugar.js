import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import { joinLobbyRoom } from '../services/SmartFoxService.js'

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

    this.vistaJugar.onAccion(async () => {
      const codigo = this.vistaJugar.getValorCampo('jugarCodigo').trim()
      const nombre = this.vistaJugar.getValorCampo('jugarNombre').trim()

      if (!codigo || !nombre) {
        this.vistaJugar.mostrarError('Ingrese el código del lobby y un nombre temporal')
        return
      }

      try {
        const lobbyData = await joinLobbyRoom(codigo, nombre)
        this.estadoApp.setTipoJugador(TIPOS_JUGADOR.INVITADO)
        this.estadoApp.setLobbyActual(lobbyData, nombre, nombre)
        this.vistaJugar.limpiarCampos()
        this.controladorEstadoApp.irAPantalla(PANTALLAS.GESTION_LOBBY)
      } catch (error) {
        this.vistaJugar.mostrarError(error.message)
      }
    })
  }
}
