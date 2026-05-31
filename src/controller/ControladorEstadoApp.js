import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import {
  leaveCurrentRoom,
  subscribeToLobbyUpdates,
  subscribeToRoomJoin,
  subscribeToRoomEnter
} from '../services/SmartFoxService.js'
import temaService from '../services/TemaService.js'

export class ControladorEstadoApp {
  constructor(estadoApp, vistas, controladorPartida = null, controladorPartidaPrueba = null, controladorEncuesta = null) {
    this.estadoApp = estadoApp
    this.vistas = vistas
    this.controladorPartida = controladorPartida
    this.controladorPartidaPrueba = controladorPartidaPrueba
    this.controladorEncuesta = controladorEncuesta
    this.perfilesAsignados = []
    this.unsubscribeLobbyUpdates = subscribeToLobbyUpdates((lobbyData) => {
      if (!lobbyData) {
        this.estadoApp.limpiarLobbyActual()
        return
      }

      this.estadoApp.setLobbyActual(
        lobbyData,
        this.estadoApp.getLobbySenderName(),
        this.estadoApp.getLobbyPlayerName()
      )

      if (this.estadoApp.pantallaActual === PANTALLAS.GESTION_LOBBY) {
        this.vistas.vistaCrearJuego.actualizarLobby(lobbyData)
      }

      if (this.estadoApp.pantallaActual === PANTALLAS.GESTION) {
        const jugadores = (lobbyData.players || [])
          .filter(p => p.name !== this.estadoApp.getUsername())
          .map(p => p.name)
        this.estadoApp.jugadoresPool = jugadores
        this.vistas.vistaGestion.actualizarSalaMaestra(lobbyData)
        this.actualizarVistaGestion()
      }
    })

    this.unsubscribeRoomJoin = subscribeToRoomJoin(({ roomName }) => {
      console.log('[ControladorEstadoApp] ROOM_JOIN callback Disparado! roomName:', roomName)
      console.log('[ControladorEstadoApp] Pantalla actual:', this.estadoApp.pantallaActual)
    })

    this.unsubscribeRoomEnter = subscribeToRoomEnter(({ roomName }) => {
      console.log('[ControladorEstadoApp] USER_ENTER_ROOM callback Disparado! roomName:', roomName)
      console.log('[ControladorEstadoApp] Pantalla actual:', this.estadoApp.pantallaActual)
    })
  }

  actualizarVista() {
    this.ocultarVistasPrimarias()

    switch (this.estadoApp.pantallaActual) {
      case PANTALLAS.INICIAL_PUBLICA:
        this.vistas.vistaInicial.mostrar()
        break
      case PANTALLAS.INICIAL_GAMEMASTER:
        this.vistas.vistaInicialR.mostrar()
        break
      case PANTALLAS.REGISTRO:
        this.vistas.vistaRegistro.mostrar()
        break
      case PANTALLAS.INICIO_SESION:
        this.vistas.vistaInicioSesion.mostrar()
        break
      case PANTALLAS.UNIRSE_LOBBY:
        this.vistas.vistaJugar.mostrar()
        break
      case PANTALLAS.GESTION_LOBBY:
        this.vistas.vistaCrearJuego.actualizarLobby(this.estadoApp.getLobbyActual())
        this.vistas.vistaCrearJuego.mostrar()
        break
      case PANTALLAS.GESTION:
        console.log('[ControladorEstadoApp] Cambiando a pantalla GESTION')
        this.vistas.vistaGestion.actualizarSalaMaestra(this.estadoApp.getSalaMaestra())
        this.actualizarVistaGestion()
        this.vistas.vistaGestion.mostrar()
        console.log('[ControladorEstadoApp] Pantalla GESTION mostrada')
        break
      case PANTALLAS.REGLAS:
        this.vistas.vistaReglas.mostrar()
        break
      case PANTALLAS.CARTAS:
        this.vistas.vistaCartas.mostrar()
        break
      case PANTALLAS.ACCIDENTES:
        this.vistas.vistaAccidentes.mostrar()
        break
      case PANTALLAS.PARTIDA:
        if (this.controladorPartida) {
          this.controladorPartida.iniciarPartida(this.estadoApp.lobbyPlayerName || 'Jugador')
        }
        this.vistas.vistaPartida.mostrar()
        break
      case PANTALLAS.PARTIDA_PRUEBA:
        if (this.controladorPartidaPrueba) {
          this.controladorPartidaPrueba.iniciarPartida('GameMaster')
        }
        this.vistas.vistaPartidaPrueba.mostrar()
        break
      case PANTALLAS.CONFIGURACION:
        this.vistas.vistaConfiguracion.mostrar()
        break
      case PANTALLAS.ENCUESTA:
        if (this.vistas.vistaEncuesta && this.controladorEncuesta) {
          this.controladorEncuesta.configurarUsuario(
            this.estadoApp.getUsername() || this.estadoApp.lobbyPlayerName || 'anonimo',
            this.estadoApp.getLobbyActual()?.code || 'N/A'
          )
        }
        this.vistas.vistaEncuesta.mostrar()
        break
      default:
        this.vistas.vistaInicial.mostrar()
        break
    }
  }

  actualizarVistaGestion() {
    if (this.vistas.vistaGestion) {
      const jugadoresPool = this.estadoApp.jugadoresPool || []
      const subSalas = this.estadoApp.subSalas || []
      const jugadoresAsignados = this.estadoApp.jugadoresAsignados || {}
      this.vistas.vistaGestion.actualizarPool(jugadoresPool)
      this.vistas.vistaGestion.actualizarSalas(subSalas, jugadoresAsignados)
    }
  }

  irAPantalla(pantalla) {
    this.estadoApp.setPantalla(pantalla)
    this.actualizarVista()
  }

  regresarPantallaAnterior() {
    this.estadoApp.regresarPantallaAnterior()
    this.actualizarVista()
  }

  ocultarVistasPrimarias() {
    this.vistas.vistaInicial.ocultar()
    this.vistas.vistaInicialR.ocultar()
    this.vistas.vistaRegistro.ocultar()
    this.vistas.vistaInicioSesion.ocultar()
    this.vistas.vistaJugar.ocultar()
    this.vistas.vistaReglas.ocultar()
    this.vistas.vistaCrearJuego.ocultar()
    this.vistas.vistaGestion.ocultar()
    this.vistas.vistaCartas.ocultar()
    this.vistas.vistaAccidentes.ocultar()
    this.vistas.vistaPartida.ocultar()
    this.vistas.vistaPartidaPrueba.ocultar()
    if (this.vistas.vistaConfiguracion) {
      this.vistas.vistaConfiguracion.ocultar()
    }
    if (this.vistas.vistaEncuesta) {
      this.vistas.vistaEncuesta.ocultar()
    }
  }

  aplicarTemaActual() {
    const temaId = temaService.obtenerTemaActual()
    const colores = temaService.obtenerColoresTema(temaId)

    this._aplicarVariablesCSS(colores)

    if (this.vistas.vistaInicial) {
      this.vistas.vistaInicial.aplicarTema(temaId)
    }
    if (this.vistas.vistaInicialR) {
      this.vistas.vistaInicialR.aplicarTema(temaId)
    }
    if (this.vistas.vistaPartida) {
      this.vistas.vistaPartida.aplicarTema(temaId)
    }
    if (this.vistas.vistaGestion) {
      this.vistas.vistaGestion.aplicarTema(temaId)
    }
    if (this.vistas.vistaRegistro) {
      this.vistas.vistaRegistro.aplicarTema(temaId)
    }
    if (this.vistas.vistaInicioSesion) {
      this.vistas.vistaInicioSesion.aplicarTema(temaId)
    }
    if (this.vistas.vistaJugar) {
      this.vistas.vistaJugar.aplicarTema(temaId)
    }
    if (this.vistas.vistaReglas) {
      this.vistas.vistaReglas.aplicarTema(temaId)
    }
    if (this.vistas.vistaCrearJuego) {
      this.vistas.vistaCrearJuego.aplicarTema(temaId)
    }
    if (this.vistas.vistaCartas) {
      this.vistas.vistaCartas.aplicarTema(temaId)
    }
    if (this.vistas.vistaAccidentes) {
      this.vistas.vistaAccidentes.aplicarTema(temaId)
    }
    if (this.vistas.vistaTutorial) {
      this.vistas.vistaTutorial.aplicarTema(temaId)
    }
  }

  _aplicarVariablesCSS(colores) {
    const root = document.documentElement
    root.style.setProperty('--overlay-bg', colores.overlay)
    root.style.setProperty('--overlay-full-bg', colores.overlayFull)
    root.style.setProperty('--topbar-bg', colores.topbar)
    root.style.setProperty('--card-bg', colores.cardBg)
    root.style.setProperty('--card-bg-solid', colores.cardBgSolid)
    root.style.setProperty('--input-bg', colores.inputBg)
    root.style.setProperty('--input-focused', colores.inputFocused)
    root.style.setProperty('--item-even', colores.itemEven)
    root.style.setProperty('--item-odd', colores.itemOdd)
    root.style.setProperty('--primary-color', colores.primary)
    root.style.setProperty('--primary-text', colores.primaryText)
    root.style.setProperty('--secondary-color', colores.secondary)
    root.style.setProperty('--secondary-text', colores.secondaryText)
    root.style.setProperty('--dark-color', colores.dark)
    root.style.setProperty('--dark-text', colores.darkText)
    root.style.setProperty('--dark-alt', colores.darkAlt)
    root.style.setProperty('--dark-alt-text', colores.darkAltText)
    root.style.setProperty('--border-color', colores.border)
    root.style.setProperty('--border-alt', colores.borderAlt)
    root.style.setProperty('--text-primary', colores.textPrimary)
    root.style.setProperty('--text-secondary', colores.textSecondary)
    root.style.setProperty('--text-body', colores.textBody)
    root.style.setProperty('--text-input', colores.textInput)
    root.style.setProperty('--placeholder', colores.placeholder)
    root.style.setProperty('--error-color', colores.error)
    root.style.setProperty('--badge-work', colores.badgeWork)
    root.style.setProperty('--badge-entertainment', colores.badgeEntertainment)
    root.style.setProperty('--hud-panel-bg', colores.hudPanelBg)
    root.style.setProperty('--hud-border-color', colores.hudBorderColor)
    root.style.setProperty('--hud-text-color', colores.hudTextColor)
    root.style.setProperty('--hud-subtext-color', colores.hudSubtextColor)
    root.style.setProperty('--hud-progreso-color', colores.hudProgresoColor)
  }

  obtenerPerfilesAsignados() {
    return this.perfilesAsignados
  }

  agregarPerfilAsignado(perfil) {
    this.perfilesAsignados.push(perfil)
  }

  reiniciarPerfilesAsignados() {
    this.perfilesAsignados = []
  }

  async cerrarSesion() {
    if (this.estadoApp.getLobbyActual()) {
      await leaveCurrentRoom()
    }

    this.estadoApp.setUsuario(null)
    this.estadoApp.setTipoJugador(TIPOS_JUGADOR.JUGADOR)
    this.estadoApp.limpiarLobbyActual()
    this.irAPantalla(PANTALLAS.INICIAL_PUBLICA)
  }
}
