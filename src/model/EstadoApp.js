import { GameMaster } from './GameMaster.js'

export const PANTALLAS = {
  INICIAL_PUBLICA: 'inicial_publica',
  INICIAL_GAMEMASTER: 'inicial_gamemaster',
  REGISTRO: 'registro',
  INICIO_SESION: 'inicio_sesion',
  UNIRSE_LOBBY: 'unirse_lobby',
  GESTION_LOBBY: 'gestion_lobby',
  GESTION: 'gestion',
  REGLAS: 'reglas',
  CARTAS: 'cartas',
  ACCIDENTES: 'accidentes',
  PARTIDA: 'partida',
  PARTIDA_PRUEBA: 'partida_prueba'
}

export const TIPOS_JUGADOR = {
  JUGADOR: 'jugador',
  GAMEMASTER: 'gamemaster',
  INVITADO: 'invitado'
}

export class EstadoApp {
  constructor() {
    this.pantallaActual = PANTALLAS.INICIAL_PUBLICA
    this.pantallaAnterior = null
    this.tipoJugador = TIPOS_JUGADOR.JUGADOR
    this.usuario = null
    this.lobbyActual = null
    this.lobbySenderName = null
    this.lobbyPlayerName = null
    this.salaMaestra = null
    this.jugadoresPool = []
    this.subSalas = []
    this.jugadoresAsignados = {}
  }

  setPantalla(pantalla) {
    this.pantallaAnterior = this.pantallaActual
    this.pantallaActual = pantalla
  }

  setTipoJugador(tipoJugador) {
    this.tipoJugador = tipoJugador
  }

  setUsuario(username) {
    if (username) {
      this.usuario = new GameMaster(username)
      this.usuario.actualizarUltimaSesion()
    } else {
      this.usuario = null
    }
  }

  getUsuario() {
    return this.usuario
  }

  getUsername() {
    return this.usuario ? this.usuario.getUsername() : null
  }

  estaLogueado() {
    return this.usuario !== null && this.tipoJugador === TIPOS_JUGADOR.GAMEMASTER
  }

  cerrarSesion() {
    this.usuario = null
    this.tipoJugador = TIPOS_JUGADOR.JUGADOR
    this.pantallaActual = PANTALLAS.INICIAL_PUBLICA
    this.pantallaAnterior = null
    this.limpiarLobbyActual()
  }

  setLobbyActual(lobbyData, senderName = null, playerName = null) {
    this.lobbyActual = lobbyData
    this.lobbySenderName = senderName
    this.lobbyPlayerName = playerName
  }

  getLobbyActual() {
    return this.lobbyActual
  }

  getLobbySenderName() {
    return this.lobbySenderName
  }

  getLobbyPlayerName() {
    return this.lobbyPlayerName
  }

  limpiarLobbyActual() {
    this.lobbyActual = null
    this.lobbySenderName = null
    this.lobbyPlayerName = null
  }

  setSalaMaestra(salaData) {
    this.salaMaestra = salaData
  }

  getSalaMaestra() {
    return this.salaMaestra
  }

  limpiarSalaMaestra() {
    this.salaMaestra = null
    this.jugadoresPool = []
    this.subSalas = []
    this.jugadoresAsignados = {}
  }

  agregarJugadorPool(nombreJugador) {
    if (!this.jugadoresPool.includes(nombreJugador)) {
      this.jugadoresPool.push(nombreJugador)
    }
  }

  removerJugadorPool(nombreJugador) {
    this.jugadoresPool = this.jugadoresPool.filter(j => j !== nombreJugador)
  }

  asignarJugadorASala(nombreJugador, numeroSala) {
    this.jugadoresAsignados[nombreJugador] = numeroSala
    this.removerJugadorPool(nombreJugador)
  }

  desasignarJugador(nombreJugador) {
    const numeroSala = this.jugadoresAsignados[nombreJugador]
    if (numeroSala !== undefined) {
      delete this.jugadoresAsignados[nombreJugador]
      this.agregarJugadorPool(nombreJugador)
    }
  }

  obtenerJugadoresDeSala(numeroSala) {
    return Object.keys(this.jugadoresAsignados).filter(
      nombre => this.jugadoresAsignados[nombre] === numeroSala
    )
  }

  crearSubSala(numero) {
    this.subSalas.push({ numero, jugadores: [] })
  }

  eliminarSubSala(numero) {
    const jugadores = this.obtenerJugadoresDeSala(numero)
    jugadores.forEach(j => this.desasignarJugador(j))
    this.subSalas = this.subSalas.filter(s => s.numero !== numero)
  }

  renumerarSubSalas() {
    const salasOrdenadas = [...this.subSalas].sort((a, b) => a.numero - b.numero)
    this.subSalas = []
    const nuevoMapeo = {}
    salasOrdenadas.forEach((sala, indice) => {
      const nuevoNumero = indice + 1
      nuevoMapeo[sala.numero] = nuevoNumero
      this.subSalas.push({ numero: nuevoNumero, jugadores: [] })
    })
    Object.keys(this.jugadoresAsignados).forEach(jugador => {
      const viejoNumero = this.jugadoresAsignados[jugador]
      if (nuevoMapeo[viejoNumero] !== undefined) {
        this.jugadoresAsignados[jugador] = nuevoMapeo[viejoNumero]
      }
    })
  }

  regresarPantallaAnterior() {
    if (!this.pantallaAnterior) return

    const pantallaTemporal = this.pantallaActual
    this.pantallaActual = this.pantallaAnterior
    this.pantallaAnterior = pantallaTemporal
  }
}
