import { PANTALLAS } from '../model/EstadoApp.js'
import { createLobbyRoom, subscribeToLobbyUpdates } from '../services/SmartFoxService.js'

const LOBBY_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const LOBBY_CODE_LENGTH = 6

export class ControladorVistaInicialR {
  constructor(
    vistaInicialR,
    vistaTutorial,
    estadoApp,
    controladorEstadoApp
  ) {
    this.vistaInicialR = vistaInicialR
    this.vistaTutorial = vistaTutorial
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
    this.unsubscribeLobbyUpdates = null
  }

  init() {
    this.vistaInicialR.onTutorial(() => {
      this.vistaTutorial.mostrar()
    })

    this.vistaInicialR.onReglas(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.REGLAS)
    })

    this.vistaInicialR.onCrearJuego(async () => {
      console.log('[ControladorVistaInicialR] Boton Crear juego presionado')
      const username = this.estadoApp.getUsername()
      console.log('[ControladorVistaInicialR] Username:', username)

      if (!username) {
        alert('Error: No se encontro nombre de usuario. Inicie sesion nuevamente.')
        return
      }

      try {
        const lobbyCode = this.generarCodigoLobby()
        console.log('[ControladorVistaInicialR] Creando sala maestra con codigo:', lobbyCode)

        const lobbyData = await createLobbyRoom(lobbyCode, username)
        console.log('[ControladorVistaInicialR] Sala maestra creada:', lobbyData)

        this.estadoApp.setSalaMaestra(lobbyData)
        this.estadoApp.jugadoresPool = []
        this.estadoApp.subSalas = []
        this.estadoApp.jugadoresAsignados = {}

        this.unsubscribeLobbyUpdates = subscribeToLobbyUpdates((updatedLobbyData) => {
          console.log('[ControladorVistaInicialR] Actualizacion de sala maestra:', updatedLobbyData)
          if (updatedLobbyData) {
            this.estadoApp.setSalaMaestra(updatedLobbyData)
            const jugadores = (updatedLobbyData.players || [])
              .filter(p => p.name !== username)
              .map(p => p.name)
            this.estadoApp.jugadoresPool = jugadores
          }
        })

        this.controladorEstadoApp.irAPantalla(PANTALLAS.GESTION)
      } catch (error) {
        console.error('[ControladorVistaInicialR] Error creando sala maestra:', error)
        console.error('[ControladorVistaInicialR] Error completo:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
        alert('Error al crear la sala maestra: ' + (error.message || error))
      }
    })

    this.vistaInicialR.onCerrarSesion(() => {

      if (this.unsubscribeLobbyUpdates) {
        this.unsubscribeLobbyUpdates()
        this.unsubscribeLobbyUpdates = null
      }
      this.controladorEstadoApp.cerrarSesion()
    })
  }

  generarCodigoLobby() {
    let code = ''
    for (let i = 0; i < LOBBY_CODE_LENGTH; i++) {
      code += LOBBY_CODE_ALPHABET.charAt(
        Math.floor(Math.random() * LOBBY_CODE_ALPHABET.length)
      )
    }
    return code
  }
}
