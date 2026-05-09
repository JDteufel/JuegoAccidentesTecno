import { logEvent } from './LogsService.js'
import {
  ensureConnection,
  sendExtensionRequest,
  subscribeToRoomJoin,
  subscribeToRoomEnter,
  subscribeToIniciarPartida,
  subscribeToJugadorSalaAsignada
} from './SmartFoxService.js'

const MAX_PLAYERS_PER_PARTIDA = 4

class PartidaService {
  constructor() {
    this.partidasActivas = {}
    this.jugadorPorPartida = {}
    this.roomJoinCallbacks = []
    this.roomEnterCallbacks = []
    this.iniciarPartidaCallbacks = []
    this.jugadorAsignadoCallbacks = []
  }

  async crearSalaPartida(nombreSala, hostName) {
    try {
      await ensureConnection(hostName)
      const respuesta = await sendExtensionRequest('crearSubSala', {
        nombreSala,
        hostName,
        maxJugadores: String(MAX_PLAYERS_PER_PARTIDA)
      })

      if (respuesta.ok) {
        this.partidasActivas[nombreSala] = {
          nombre: nombreSala,
          host: hostName,
          jugadores: [hostName],
          estado: 'esperando',
          createdAt: new Date().toISOString()
        }

        logEvent('PARTIDA', 'create', { nombreSala, hostName })
      }

      return respuesta
    } catch (error) {
      console.error('[PartidaService] Error creando sala de partida:', error)
      return { ok: false, message: error.message }
    }
  }

  async unirseASalaPartida(nombreSala, nombreJugador) {
    try {
      const partida = this.partidasActivas[nombreSala]
      if (!partida) {
        return { ok: false, message: 'Sala de partida no encontrada' }
      }

      if (partida.jugadores.length >= MAX_PLAYERS_PER_PARTIDA) {
        return { ok: false, message: `La partida alcanzó el máximo de jugadores (${MAX_PLAYERS_PER_PARTIDA})` }
      }

      if (partida.jugadores.includes(nombreJugador)) {
        return { ok: false, message: 'El jugador ya está en esta partida' }
      }

      await ensureConnection(nombreJugador)
      const respuesta = await sendExtensionRequest('unirseSubSala', {
        nombreSala,
        nombreJugador
      })

      if (respuesta.ok) {
        partida.jugadores.push(nombreJugador)
        this.jugadorPorPartida[nombreJugador] = nombreSala

        logEvent('PARTIDA', 'join', { nombreSala, nombreJugador })
      }

      return respuesta
    } catch (error) {
      console.error('[PartidaService] Error uniéndose a sala de partida:', error)
      return { ok: false, message: error.message }
    }
  }

  async iniciarPartida(nombreSala) {
    try {
      const partida = this.partidasActivas[nombreSala]
      if (!partida) {
        return { ok: false, message: 'Sala de partida no encontrada' }
      }

      if (partida.jugadores.length < 2) {
        return { ok: false, message: 'Se necesitan al menos 2 jugadores para iniciar' }
      }

      const respuesta = await sendExtensionRequest('iniciarPartida', {
        nombreSala
      })

      if (respuesta.ok) {
        partida.estado = 'en_curso'

        logEvent('PARTIDA', 'start', { nombreSala, jugadores: partida.jugadores })
      }

      return respuesta
    } catch (error) {
      console.error('[PartidaService] Error iniciando partida:', error)
      return { ok: false, message: error.message }
    }
  }

  obtenerEstadoPartida(nombreSala) {
    const partida = this.partidasActivas[nombreSala]
    if (!partida) {
      return { ok: false, message: 'Sala de partida no encontrada' }
    }

    return {
      ok: true,
      partida: {
        nombre: partida.nombre,
        host: partida.host,
        jugadores: partida.jugadores,
        jugadorCount: partida.jugadores.length,
        maxJugadores: MAX_PLAYERS_PER_PARTIDA,
        estado: partida.estado,
        createdAt: partida.createdAt
      }
    }
  }

  obtenerPartidaDelJugador(nombreJugador) {
    const nombreSala = this.jugadorPorPartida[nombreJugador]
    if (!nombreSala) {
      return null
    }
    return this.partidasActivas[nombreSala] || null
  }

  obtenerTodasLasPartidas() {
    return Object.values(this.partidasActivas)
  }

  asignarJugadorASala(nombreJugador, nombreSala) {
    const partida = this.partidasActivas[nombreSala]
    if (!partida) {
      return { ok: false, message: 'Sala de partida no encontrada' }
    }

    if (partida.jugadores.length >= MAX_PLAYERS_PER_PARTIDA) {
      return { ok: false, message: `La partida alcanzó el máximo de jugadores (${MAX_PLAYERS_PER_PARTIDA})` }
    }

    if (partida.jugadores.includes(nombreJugador)) {
      return { ok: false, message: 'El jugador ya está en esta partida' }
    }

    const partidaActual = this.obtenerPartidaDelJugador(nombreJugador)
    if (partidaActual) {
      this.removerJugadorDePartida(nombreJugador, partidaActual.nombre)
    }

    partida.jugadores.push(nombreJugador)
    this.jugadorPorPartida[nombreJugador] = nombreSala

    logEvent('PARTIDA', 'assign', { nombreSala, nombreJugador })

    this._notificarJugadorAsignado(nombreJugador, nombreSala)

    return { ok: true, nombreSala }
  }

  removerJugadorDePartida(nombreJugador, nombreSala) {
    const partida = this.partidasActivas[nombreSala]
    if (!partida) {
      return
    }

    const indice = partida.jugadores.indexOf(nombreJugador)
    if (indice !== -1) {
      partida.jugadores.splice(indice, 1)
    }

    delete this.jugadorPorPartida[nombreJugador]

    logEvent('PARTIDA', 'leave', { nombreSala, nombreJugador })
  }

  cerrarPartida(nombreSala) {
    const partida = this.partidasActivas[nombreSala]
    if (!partida) {
      return
    }

    partida.jugadores.forEach(jugador => {
      delete this.jugadorPorPartida[jugador]
    })

    partida.estado = 'cerrada'

    logEvent('PARTIDA', 'close', { nombreSala })

    delete this.partidasActivas[nombreSala]
  }

  onJugadorAsignado(callback) {
    this.jugadorAsignadoCallbacks.push(callback)
  }

  _notificarJugadorAsignado(nombreJugador, nombreSala) {
    this.jugadorAsignadoCallbacks.forEach(callback => {
      try {
        callback({ nombreJugador, nombreSala })
      } catch (error) {
        console.warn('[PartidaService] Error notificando jugador asignado:', error)
      }
    })
  }

  registrarSmartFoxListeners() {
    subscribeToRoomJoin(({ roomName, room }) => {
      if (!this.partidasActivas[roomName]) {
        this.partidasActivas[roomName] = {
          nombre: roomName,
          host: '',
          jugadores: [],
          estado: 'esperando',
          createdAt: new Date().toISOString()
        }
      }
    })

    subscribeToRoomEnter(({ roomName, room }) => {
      const partida = this.partidasActivas[roomName]
      if (partida) {
        logEvent('PARTIDA', 'enter', { nombreSala: roomName })
      }
    })

    subscribeToIniciarPartida(({ nombreSala, ok }) => {
      if (ok && this.partidasActivas[nombreSala]) {
        this.partidasActivas[nombreSala].estado = 'en_curso'
      }

      this.iniciarPartidaCallbacks.forEach(callback => {
        try {
          callback({ nombreSala, ok })
        } catch (error) {
          console.warn('[PartidaService] Error notificando inicio de partida:', error)
        }
      })
    })

    subscribeToJugadorSalaAsignada(({ nombreSala, numeroSala, ok, message }) => {
      this.jugadorAsignadoCallbacks.forEach(callback => {
        try {
          callback({ nombreSala, numeroSala, ok, message })
        } catch (error) {
          console.warn('[PartidaService] Error notificando asignación de jugador:', error)
        }
      })
    })
  }

  onIniciarPartida(callback) {
    this.iniciarPartidaCallbacks.push(callback)
  }
}

const partidaService = new PartidaService()
export default partidaService
export { PartidaService, MAX_PLAYERS_PER_PARTIDA }
