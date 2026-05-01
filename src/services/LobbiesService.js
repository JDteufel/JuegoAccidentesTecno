import { logEvent } from './LogsService.js'
const LOBBY_CODE_LENGTH = 6
const LOBBY_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const MAX_PLAYERS_PER_LOBBY = 16
class LobbiesService {
  constructor() {
    this.lobbiesByCode = {} 
    this.lobbyCodeBySender = {} 
  }
  crearLobby(hostName, senderName) {
    if (!hostName || hostName.trim().length === 0) {
      return {
        ok: false,
        message: 'El nombre del anfitrión es obligatorio'
      }
    }
    if (this.lobbyCodeBySender[senderName]) {
      const existingCode = this.lobbyCodeBySender[senderName]
      return {
        ok: false,
        message: `El usuario ya tiene un lobby activo: ${existingCode}`
      }
    }
    const lobbyCode = this._generarCodigoUnico()
    const hostPlayer = this._crearRegistroJugador({
      name: hostName,
      senderName: senderName,
      role: 'host'
    })
    this.lobbiesByCode[lobbyCode] = {
      code: lobbyCode,
      hostName: hostName,
      hostSenderName: senderName,
      createdAt: new Date().toISOString(),
      players: [hostPlayer],
      matches: [],
      status: 'waiting'
    }
    this.lobbyCodeBySender[senderName] = lobbyCode
    logEvent('LOBBY', 'create', { lobbyCode, hostName })
    return {
      ok: true,
      message: 'Lobby creado exitosamente',
      lobbyCode: lobbyCode
    }
  }
  unirseALobby(lobbyCode, guestName, senderName) {
    if (!lobbyCode || lobbyCode.trim().length === 0) {
      return {
        ok: false,
        message: 'El código del lobby es obligatorio'
      }
    }
    if (!guestName || guestName.trim().length === 0) {
      return {
        ok: false,
        message: 'El nombre temporal es obligatorio'
      }
    }
    const normalizedCode = this._normalizarCodigo(lobbyCode)
    const lobby = this.lobbiesByCode[normalizedCode]
    if (!lobby) {
      return {
        ok: false,
        message: 'Lobby no encontrado'
      }
    }
    if (this.lobbyCodeBySender[senderName]) {
      return {
        ok: false,
        message: 'El usuario ya pertenece a un lobby activo'
      }
    }
    if (lobby.players.length >= MAX_PLAYERS_PER_LOBBY) {
      return {
        ok: false,
        message: `El lobby alcanzó el máximo de jugadores (${MAX_PLAYERS_PER_LOBBY})`
      }
    }
    if (this._contienteNombreJugador(lobby.players, guestName)) {
      return {
        ok: false,
        message: 'Ya existe un jugador con ese nombre en el lobby'
      }
    }
    const guestPlayer = this._crearRegistroJugador({
      name: guestName,
      senderName: senderName,
      role: 'guest'
    })
    lobby.players.push(guestPlayer)
    this.lobbyCodeBySender[senderName] = lobby.code
    logEvent('LOBBY', 'join', { lobbyCode: lobby.code, guestName })
    return {
      ok: true,
      message: 'Unido al lobby exitosamente',
      lobbyData: this._construirRespuestaLobby(lobby.code)
    }
  }
  obtenerEstadoLobby(lobbyCode = null, senderName = null) {
    let codigoLobby = lobbyCode
    if (!codigoLobby && senderName) {
      codigoLobby = this.lobbyCodeBySender[senderName]
    }
    if (!codigoLobby) {
      return {
        ok: false,
        message: 'No se encontró un lobby asociado al usuario'
      }
    }
    const normalizedCode = this._normalizarCodigo(codigoLobby)
    const lobby = this.lobbiesByCode[normalizedCode]
    if (!lobby) {
      return {
        ok: false,
        message: 'Lobby no encontrado'
      }
    }
    return {
      ok: true,
      lobbyData: this._construirRespuestaLobby(normalizedCode)
    }
  }
  salirDelLobby(lobbyCode = null, senderName) {
    let codigoLobby = lobbyCode
    if (!codigoLobby) {
      codigoLobby = this.lobbyCodeBySender[senderName]
    }
    if (!codigoLobby) {
      return {
        ok: false,
        message: 'No se encontró un lobby asociado al usuario'
      }
    }
    const normalizedCode = this._normalizarCodigo(codigoLobby)
    const lobby = this.lobbiesByCode[normalizedCode]
    if (!lobby) {
      return {
        ok: false,
        message: 'Lobby no encontrado'
      }
    }
    const jugadorRemovido = this._removerJugadorDelLobby(lobby, senderName)
    if (!jugadorRemovido) {
      return {
        ok: false,
        message: 'El usuario no pertenece al lobby indicado'
      }
    }
    delete this.lobbyCodeBySender[senderName]
    logEvent('LOBBY', 'leave', { lobbyCode: normalizedCode, playerName: jugadorRemovido.name })
    if (lobby.players.length === 0 || jugadorRemovido.role === 'host') {
      this._eliminarLobby(normalizedCode)
      return {
        ok: true,
        message: 'Lobby cerrado',
        lobbyClosed: true
      }
    }
    return {
      ok: true,
      message: 'Salida del lobby exitosa',
      lobbyData: this._construirRespuestaLobby(normalizedCode)
    }
  }
  obtenerTodosLosLobbies() {
    return Object.values(this.lobbiesByCode)
  }
  obtenerCodigoDelSender(senderName) {
    return this.lobbyCodeBySender[senderName] || null
  }
  _generarCodigoUnico() {
    let codigo = this._generarCodigo()
    while (this.lobbiesByCode[codigo]) {
      codigo = this._generarCodigo()
    }
    return codigo
  }
  _generarCodigo() {
    let code = ''
    for (let i = 0; i < LOBBY_CODE_LENGTH; i++) {
      code += LOBBY_CODE_ALPHABET.charAt(
        Math.floor(Math.random() * LOBBY_CODE_ALPHABET.length)
      )
    }
    return code
  }
  _normalizarCodigo(code) {
    return (code || '').toUpperCase()
  }
  _crearRegistroJugador(input) {
    return {
      name: this._sanearNombreJugador(input.name),
      senderName: input.senderName,
      role: input.role,
      joinedAt: new Date().toISOString()
    }
  }
  _sanearNombreJugador(value) {
    let sanitized = value || ''
    sanitized = sanitized.replace(/\s+/g, ' ')
    sanitized = sanitized.replace(/^\s+|\s+$/g, '')
    if (sanitized.length > 20) {
      sanitized = sanitized.substring(0, 20)
    }
    return sanitized
  }
  _normalizarNombre(value) {
    return this._sanearNombreJugador(value).toLowerCase()
  }
  _contienteNombreJugador(players, playerName) {
    const normalizedName = this._normalizarNombre(playerName)
    return players.some(p => this._normalizarNombre(p.name) === normalizedName)
  }
  _removerJugadorDelLobby(lobby, senderName) {
    const index = lobby.players.findIndex(p => p.senderName === senderName)
    if (index === -1) return null
    const removed = lobby.players.splice(index, 1)
    return removed[0]
  }
  _construirRespuestaLobby(lobbyCode) {
    const lobby = this.lobbiesByCode[lobbyCode]
    if (!lobby) return null
    return {
      ok: true,
      lobbyCode: lobby.code,
      hostName: lobby.hostName,
      status: lobby.status,
      createdAt: lobby.createdAt,
      playerCount: lobby.players.length,
      players: lobby.players.map(p => ({
        name: p.name,
        role: p.role,
        joinedAt: p.joinedAt
      }))
    }
  }
  _eliminarLobby(lobbyCode) {
    const lobby = this.lobbiesByCode[lobbyCode]
    if (!lobby) return
    lobby.players.forEach(player => {
      delete this.lobbyCodeBySender[player.senderName]
    })
    delete this.lobbiesByCode[lobbyCode]
  }
}
const lobbiesService = new LobbiesService()
export default lobbiesService
export { LobbiesService }
