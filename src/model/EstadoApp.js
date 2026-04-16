import { Usuario } from './Usuario.js'

export const PANTALLAS = {
  INICIAL_PUBLICA: 'inicial_publica',
  INICIAL_REGISTRADO: 'inicial_registrado',
  REGISTRO: 'registro',
  INICIO_SESION: 'inicio_sesion',
  UNIRSE_LOBBY: 'unirse_lobby',
  GESTION_LOBBY: 'gestion_lobby',
  REGLAS: 'reglas',
  CARTAS: 'cartas',
  ACCIDENTES: 'accidentes',
  PARTIDA: 'partida'
}

export const TIPOS_JUGADOR = {
  VISITANTE: 'visitante',
  REGISTRADO: 'registrado',
  INVITADO: 'invitado'
}

export class EstadoApp {
  constructor() {
    this.pantallaActual = PANTALLAS.INICIAL_PUBLICA
    this.pantallaAnterior = null
    this.tipoJugador = TIPOS_JUGADOR.VISITANTE
    this.usuario = null
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
      this.usuario = new Usuario(username)
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
    return this.usuario !== null && this.tipoJugador === TIPOS_JUGADOR.REGISTRADO
  }

  cerrarSesion() {
    this.usuario = null
    this.tipoJugador = TIPOS_JUGADOR.VISITANTE
    this.pantallaActual = PANTALLAS.INICIAL_PUBLICA
    this.pantallaAnterior = null
  }

  regresarPantallaAnterior() {
    if (!this.pantallaAnterior) return

    const pantallaTemporal = this.pantallaActual
    this.pantallaActual = this.pantallaAnterior
    this.pantallaAnterior = pantallaTemporal
  }
}
