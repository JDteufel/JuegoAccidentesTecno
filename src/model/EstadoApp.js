export const PANTALLAS = {
  INICIAL_PUBLICA: 'inicial_publica',
  INICIAL_REGISTRADO: 'inicial_registrado',
  REGISTRO: 'registro',
  INICIO_SESION: 'inicio_sesion',
  UNIRSE_LOBBY: 'unirse_lobby',
  GESTION_LOBBY: 'gestion_lobby',
  REGLAS: 'reglas'
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
  }

  setPantalla(pantalla) {
    this.pantallaAnterior = this.pantallaActual
    this.pantallaActual = pantalla
  }

  setTipoJugador(tipoJugador) {
    this.tipoJugador = tipoJugador
  }

  regresarPantallaAnterior() {
    if (!this.pantallaAnterior) return

    const pantallaTemporal = this.pantallaActual
    this.pantallaActual = this.pantallaAnterior
    this.pantallaAnterior = pantallaTemporal
  }
}
