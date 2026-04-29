import { PANTALLAS } from '../model/EstadoApp.js'
import { createLobbyRoom } from '../services/SmartFoxService.js'

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
  }

  init() {
    this.vistaInicialR.setOnTutorial(() => {
      this.vistaTutorial.mostrar()
    })

    this.vistaInicialR.setOnReglas(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.REGLAS)
    })

    this.vistaInicialR.setOnCrearJuego(async () => {
      const username = this.estadoApp.getUsername()

      if (!username) {
        return
      }

      try {
        const lobbyCode = this.generarCodigoLobby()
        const lobbyData = await createLobbyRoom(lobbyCode, username)
        this.estadoApp.setLobbyActual(lobbyData, username, username)
        this.controladorEstadoApp.irAPantalla(PANTALLAS.GESTION_LOBBY)
      } catch (error) {
        console.error('[ControladorVistaInicialR] Error creando room:', error)
      }
    })

    this.vistaInicialR.setOnCerrarSesion(() => {
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
