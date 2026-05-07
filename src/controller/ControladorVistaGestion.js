import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import {
  leaveCurrentRoom,
  subscribeToLobbyUpdates,
  subscribeToRoomJoin,
  subscribeToRoomEnter,
  sendExtensionRequest,
  ensureConnection,
  emitLobbyUpdate
} from '../services/SmartFoxService.js'

class EstrategiaDistribucion {
  ejecutar(jugadores, salasDisponibles) {
    throw new Error('Método ejecutar() debe ser implementado')
  }
}

class EstrategiaBalanceada extends EstrategiaDistribucion {
  ejecutar(jugadores, salasDisponibles) {
    if (!jugadores || jugadores.length === 0) return {}
    if (!salasDisponibles || salasDisponibles.length === 0) return {}

    const asignacion = {}
    const capacidadPorSala = 4
    let salaIndex = 0
    let jugadoresEnSalaActual = 0

    for (const jugador of jugadores) {
      if (salaIndex >= salasDisponibles.length) break

      const salaNumero = salasDisponibles[salaIndex]
      asignacion[jugador] = salaNumero
      jugadoresEnSalaActual++

      if (jugadoresEnSalaActual >= capacidadPorSala) {
        salaIndex++
        jugadoresEnSalaActual = 0
      }
    }

    return asignacion
  }
}

class EstrategiaSecuencial extends EstrategiaDistribucion {
  ejecutar(jugadores, salasDisponibles) {
    if (!jugadores || jugadores.length === 0) return {}
    if (!salasDisponibles || salasDisponibles.length === 0) return {}

    const asignacion = {}
    const capacidadPorSala = 4

    for (let i = 0; i < jugadores.length; i++) {
      const salaIndex = Math.floor(i / capacidadPorSala)
      if (salaIndex >= salasDisponibles.length) break
      asignacion[jugadores[i]] = salasDisponibles[salaIndex]
    }

    return asignacion
  }
}

class EstrategiaPersonalizada extends EstrategiaDistribucion {
  constructor() {
    super()
    this._asignacionPrevia = {}
  }

  ejecutar(jugadores, salasDisponibles) {
    if (!jugadores || jugadores.length === 0) return {}
    const asignacion = {}
    for (const jugador of jugadores) {
      if (this._asignacionPrevia[jugador]) {
        asignacion[jugador] = this._asignacionPrevia[jugador]
      }
    }
    return asignacion
  }

  actualizarAsignacion(jugador, salaNumero) {
    this._asignacionPrevia[jugador] = salaNumero
  }

  eliminarAsignacion(jugador) {
    delete this._asignacionPrevia[jugador]
  }
}

export class ControladorVistaGestion {
  constructor(vistaGestion, estadoApp, controladorEstadoApp) {
    this.vistaGestion = vistaGestion
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
    this.unsubscribeLobbyUpdates = null
    this.unsubscribeRoomJoin = null
    this.unsubscribeRoomEnter = null
    this.extensionResponseHandler = null
    this.salaTransitionTimeout = null
    this.estrategiaActual = new EstrategiaBalanceada()
    this.estrategiaPersonalizada = new EstrategiaPersonalizada()
  }

  init() {
    const salaActual = this.estadoApp.getSalaMaestra()
    if (salaActual) {
      this.vistaGestion.actualizarSalaMaestra(salaActual)
      this.actualizarVistaGestion()
    }

    this.unsubscribeRoomJoin = subscribeToRoomJoin(({ roomName }) => {
      console.log('[ControladorVistaGestion] ROOM_JOIN callback Disparado! roomName:', roomName)
      this.transicionarASala(roomName)
    })

    this.unsubscribeRoomEnter = subscribeToRoomEnter(({ roomName }) => {
      console.log('[ControladorVistaGestion] USER_ENTER_ROOM callback Disparado! roomName:', roomName)
      this.transicionarASala(roomName)
    })

    this.unsubscribeLobbyUpdates = subscribeToLobbyUpdates((lobbyData) => {
      if (lobbyData) {
        this.estadoApp.setSalaMaestra(lobbyData)
        const jugadores = (lobbyData.players || [])
          .filter(p => p.name !== this.estadoApp.getUsername())
          .map(p => p.name)

        this.estadoApp.jugadoresPool = jugadores
        this.vistaGestion.actualizarSalaMaestra(lobbyData)
        this.actualizarVistaGestion()
      }
    })

    this.vistaGestion.onVolver(async () => {
      this.limpiarTransicion()

      if (this.unsubscribeRoomJoin) {
        this.unsubscribeRoomJoin()
        this.unsubscribeRoomJoin = null
      }

      if (this.unsubscribeRoomEnter) {
        this.unsubscribeRoomEnter()
        this.unsubscribeRoomEnter = null
      }

      if (this.unsubscribeLobbyUpdates) {
        this.unsubscribeLobbyUpdates()
        this.unsubscribeLobbyUpdates = null
      }

      if (this.estadoApp.getSalaMaestra()) {
        await leaveCurrentRoom()
        this.estadoApp.limpiarSalaMaestra()
      }

      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_GAMEMASTER)
    })

    this.vistaGestion.onAutoDistribuir(() => {
      this.autoDistribuir()
    })

    this.vistaGestion.onIniciarTodas(() => {
      this.iniciarTodasLasSalas()
    })

    this.vistaGestion.onProbar(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.PARTIDA_PRUEBA)
    })

    for (let i = 1; i <= 8; i++) {
      this.vistaGestion.onIniciarSala(i, () => {
        this.iniciarSala(i)
      })
    }

    this.vistaGestion.onJugadorSoltado((nombreJugador, salaNumero, slotIndex) => {
      this.asignarJugadorManual(nombreJugador, salaNumero, slotIndex)
    })
  }

  transicionarASala(roomName, numeroSala) {
    console.log('[ControladorVistaGestion] Transicionando a VistaPartida:', roomName)
    this.limpiarTransicion()

    const tipoJugador = this.estadoApp.tipoJugador
    console.log('[ControladorVistaGestion] Tipo jugador actual:', tipoJugador)

    if (tipoJugador === TIPOS_JUGADOR.GAMEMASTER) {
      console.log('[ControladorVistaGestion] GameMaster (GAMEMASTER) NO debe entrar a VistaPartida - permaneciendo en GESTION')
      this.vistaGestion.mostrarMensajeFinal('Esperando a que los jugadores terminen...')
      return
    }

    console.log('[ControladorVistaGestion] Jugador (no GameMaster) transicionando a VistaPartida')
    this.controladorEstadoApp.irAPantalla(PANTALLAS.PARTIDA)
  }

  limpiarTransicion() {
    if (this.salaTransitionTimeout) {
      clearTimeout(this.salaTransitionTimeout)
      this.salaTransitionTimeout = null
    }
  }

  actualizarVistaGestion() {
    const jugadoresPool = this.estadoApp.jugadoresPool || []
    const subSalas = this.estadoApp.subSalas || []
    const jugadoresAsignados = this.estadoApp.jugadoresAsignados || {}

    this.vistaGestion.actualizarPool(jugadoresPool)
    this.vistaGestion.actualizarSalas(subSalas, jugadoresAsignados)
  }

  establecerEstrategia(tipo) {
    switch (tipo) {
      case 'balanceada':
        this.estrategiaActual = new EstrategiaBalanceada()
        break
      case 'secuencial':
        this.estrategiaActual = new EstrategiaSecuencial()
        break
      case 'personalizada':
        this.estrategiaActual = this.estrategiaPersonalizada
        break
      default:
        this.estrategiaActual = new EstrategiaBalanceada()
    }
  }

  autoDistribuir() {
    const jugadoresPool = [...this.estadoApp.jugadoresPool]
    if (jugadoresPool.length === 0) {
      this.vistaGestion.mostrarError('No hay jugadores en espera para distribuir')
      return
    }

    const subSalas = this.estadoApp.subSalas || []
    if (subSalas.length === 0) {
      for (let i = 1; i <= 8; i++) {
        subSalas.push({ numero: i, jugadores: [] })
      }
    }

    const salasDisponibles = subSalas.map(s => s.numero)
    const asignacion = this.estrategiaActual.ejecutar(jugadoresPool, salasDisponibles)

    const jugadoresAsignados = { ...this.estadoApp.jugadoresAsignados }
    for (const [jugador, sala] of Object.entries(asignacion)) {
      jugadoresAsignados[jugador] = sala
      if (this.estrategiaActual instanceof EstrategiaPersonalizada) {
        this.estrategiaPersonalizada.actualizarAsignacion(jugador, sala)
      }
    }

    this.estadoApp.subSalas = subSalas
    this.estadoApp.jugadoresAsignados = jugadoresAsignados
    this.estadoApp.jugadoresPool = []

    this.actualizarVistaGestion()
  }

  asignarJugadorManual(nombreJugador, salaNumero, slotIndex) {
    const jugadoresPool = this.estadoApp.jugadoresPool || []
    const idx = jugadoresPool.indexOf(nombreJugador)
    if (idx === -1) {
      this.vistaGestion.mostrarError('Jugador no encontrado en el pool')
      return
    }

    const jugadoresEnSala = this.estadoApp.obtenerJugadoresDeSala(salaNumero)

    if (jugadoresEnSala.length >= 4) {
      this.vistaGestion.mostrarError(`La Sala ${salaNumero} está llena (max 4 jugadores)`)
      return
    }

    const jugadoresAsignados = { ...this.estadoApp.jugadoresAsignados }
    jugadoresAsignados[nombreJugador] = salaNumero

    const jugadoresPoolActualizado = jugadoresPool.filter((_, i) => i !== idx)

    const subSalas = this.estadoApp.subSalas || []
    if (!subSalas.find(s => s.numero === salaNumero)) {
      subSalas.push({ numero: salaNumero, jugadores: [] })
    }

    this.estadoApp.jugadoresPool = jugadoresPoolActualizado
    this.estadoApp.jugadoresAsignados = jugadoresAsignados
    this.estadoApp.subSalas = subSalas

    if (this.estrategiaActual instanceof EstrategiaPersonalizada) {
      this.estrategiaPersonalizada.actualizarAsignacion(nombreJugador, salaNumero)
    }

    this.actualizarVistaGestion()
  }

  async iniciarSala(numero) {
    this.vistaGestion.limpiarErrorSala(numero)
    this.vistaGestion.setSalaIniciando(numero, true)

    const jugadoresEnSala = this.estadoApp.obtenerJugadoresDeSala(numero)

    if (jugadoresEnSala.length < 2) {
      this.vistaGestion.mostrarErrorSala(numero, 'Min 2 jugadores')
      this.vistaGestion.setSalaIniciando(numero, false)
      return
    }

    if (jugadoresEnSala.length > 4) {
      this.vistaGestion.mostrarErrorSala(numero, 'Max 4 jugadores')
      this.vistaGestion.setSalaIniciando(numero, false)
      return
    }

    const salaMaestra = this.estadoApp.getSalaMaestra()
    if (!salaMaestra) {
      this.vistaGestion.mostrarError('No hay sala maestra activa')
      this.vistaGestion.setSalaIniciando(numero, false)
      return
    }

    this.limpiarTransicion()

    try {
      const nombreSala = `Sala_${salaMaestra.lobbyCode}_${numero}`
      const username = this.estadoApp.getUsername()

      console.log(`[ControladorVistaGestion] Creando sub-sala: ${nombreSala}`)
      console.log(`[ControladorVistaGestion] Jugadores:`, jugadoresEnSala)

      await ensureConnection(username)

      const jugadoresJSON = JSON.stringify(jugadoresEnSala)

      const respuesta = await sendExtensionRequest('crearSubSala', {
        nombreSala,
        numeroSala: String(numero),
        jugadores: jugadoresJSON,
        salaMaestra: salaMaestra.lobbyCode
      })

      console.log(`[ControladorVistaGestion] Respuesta del servidor:`, respuesta)

      if (!respuesta || respuesta.ok === false) {
        throw new Error(respuesta?.message || 'Error desconocido al crear la sala')
      }

      console.log(`[ControladorVistaGestion] Sub-sala creada exitosamente: ${nombreSala}`)

      this.vistaGestion.setSalaEstado(numero, 'jugadoresListos')

      console.log(`[ControladorVistaGestion] Forzando actualizacion de lobby para GameMaster`)
      emitLobbyUpdate()

      console.log(`[ControladorVistaGestion] Enviando senal iniciarPartida a jugadores`)

      this.vistaGestion.setSalaEstado(numero, 'iniciando')

      const respuestaIniciar = await sendExtensionRequest('iniciarPartida', {
        nombreSala: nombreSala
      })

      console.log(`[ControladorVistaGestion] Respuesta iniciarPartida:`, respuestaIniciar)

      this.vistaGestion.setSalaEstado(numero, 'iniciada')
      this.vistaGestion.mostrarMensajeFinal('Partida Iniciada!')

    } catch (error) {
      console.error('[ControladorVistaGestion] Error iniciando sala:', error)
      this.vistaGestion.mostrarErrorSala(numero, `Error: ${error.message}`)
      this.vistaGestion.setSalaEstado(numero, 'disponible')
    }
  }

  async iniciarTodasLasSalas() {
    const subSalas = this.estadoApp.subSalas || []
    const salasListas = subSalas.filter(sala => {
      const jugadores = this.estadoApp.obtenerJugadoresDeSala(sala.numero)
      return jugadores.length >= 2 && jugadores.length <= 4
    })

    if (salasListas.length === 0) {
      this.vistaGestion.mostrarError('No hay salas listas para iniciar (min 2 jugadores)')
      return
    }

    for (const sala of salasListas) {
      this.vistaGestion.limpiarErrorSala(sala.numero)
      await this.iniciarSala(sala.numero)
    }
  }
}
