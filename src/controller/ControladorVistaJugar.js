import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import { joinLobbyRoom, leaveCurrentRoom, subscribeToLobbyUpdates, subscribeToRoomJoin, subscribeToRoomEnter, subscribeToIniciarPartida, subscribeToJugadorSalaAsignada } from '../services/SmartFoxService.js'

export class ControladorVistaJugar {
  constructor(vistaJugar, estadoApp, controladorEstadoApp) {
    this.vistaJugar = vistaJugar
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
    this.unsubscribeLobbyUpdates = null
    this.unsubscribeRoomJoin = null
    this.unsubscribeRoomEnter = null
    this.unsubscribeIniciarPartida = null
    this.unsubscribeJugadorSalaAsignada = null
  }

  init() {
    this.vistaJugar.onVolver(() => {
      this.limpiarSuscripciones()
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

        this.vistaJugar.mostrarError('Conectando al lobby...')

        const lobbyData = await joinLobbyRoom(codigo, nombre)
        this.estadoApp.setTipoJugador(TIPOS_JUGADOR.INVITADO)
        this.estadoApp.setLobbyActual(lobbyData, nombre, nombre)
        this.vistaJugar.limpiarCampos()
        this.vistaJugar.limpiarError()

        this.unsubscribeLobbyUpdates = subscribeToLobbyUpdates((lobbyData) => {
          console.log('[ControladorVistaJugar] Actualización de lobby:', lobbyData)

          if (lobbyData) {

            this.estadoApp.setLobbyActual(lobbyData, nombre, nombre)
          } else {

            this.estadoApp.limpiarLobbyActual()
          }
        })

        this.unsubscribeRoomJoin = subscribeToRoomJoin(({ roomName }) => {
          console.log('[ControladorVistaJugar] ROOM_JOIN callback Disparado! roomName:', roomName)
          console.log('[ControladorVistaJugar] Ignorando - solo se transiciona cuando GameMaster presiona Iniciar')
        })

        this.unsubscribeRoomEnter = subscribeToRoomEnter(({ roomName }) => {
          console.log('[ControladorVistaJugar] USER_ENTER_ROOM callback Disparado! roomName:', roomName)
          console.log('[ControladorVistaJugar] Ignorando - solo se transiciona cuando GameMaster presiona Iniciar')
        })

        this.unsubscribeIniciarPartida = subscribeToIniciarPartida(({ nombreSala, ok }) => {
          console.log('[ControladorVistaJugar] iniciarPartida callback Disparado! nombreSala:', nombreSala, 'ok:', ok)
          if (ok) {
            console.log('[ControladorVistaJugar] Transicionando a VistaPartida')
            this.controladorEstadoApp.irAPantalla(PANTALLAS.PARTIDA)
          }
        })

        this.unsubscribeJugadorSalaAsignada = subscribeToJugadorSalaAsignada(({ nombreSala, numeroSala, ok, message }) => {
          console.log('[ControladorVistaJugar] jugadorSalaAsignada callback Disparado! nombreSala:', nombreSala, 'numeroSala:', numeroSala, 'ok:', ok, 'message:', message)

          if (ok && nombreSala) {
            console.log('[ControladorVistaJugar] Jugador movido a sala, actualizando lobbyActual con nombreSala:', nombreSala)

            const currentLobby = this.estadoApp.getLobbyActual()
            if (currentLobby) {
              const updatedLobby = {
                ...currentLobby,
                lobbyCode: nombreSala,
                status: 'inSubSala',
                numeroSala: numeroSala
              }
              console.log('[ControladorVistaJugar] Actualizando lobby con:', updatedLobby)
              this.estadoApp.setLobbyActual(updatedLobby, nombre, nombre)
            }
          }
        })

        this.controladorEstadoApp.irAPantalla(PANTALLAS.GESTION_LOBBY)
      } catch (error) {
        console.error('[ControladorVistaJugar] Error uniéndose al lobby:', error)
        this.vistaJugar.mostrarError(error.message)
      }
    })
  }

  limpiarSuscripciones() {
    if (this.unsubscribeLobbyUpdates) {
      this.unsubscribeLobbyUpdates()
      this.unsubscribeLobbyUpdates = null
    }
    if (this.unsubscribeRoomJoin) {
      this.unsubscribeRoomJoin()
      this.unsubscribeRoomJoin = null
    }
    if (this.unsubscribeRoomEnter) {
      this.unsubscribeRoomEnter()
      this.unsubscribeRoomEnter = null
    }
    if (this.unsubscribeIniciarPartida) {
      this.unsubscribeIniciarPartida()
      this.unsubscribeIniciarPartida = null
    }
    if (this.unsubscribeJugadorSalaAsignada) {
      this.unsubscribeJugadorSalaAsignada()
      this.unsubscribeJugadorSalaAsignada = null
    }
  }
}
