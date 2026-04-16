/**
 * Usuario - Clase que representa un usuario registrado en el sistema
 */
export class Usuario {
  constructor(username) {
    this.username = username
    this.tipo = 'registrado'
    this.fechaRegistro = new Date().toISOString()
    this.ultimaSesion = null
  }

  setUsername(username) {
    this.username = username
  }

  getUsername() {
    return this.username
  }

  getTipo() {
    return this.tipo
  }

  actualizarUltimaSesion() {
    this.ultimaSesion = new Date().toISOString()
  }

  toJSON() {
    return {
      username: this.username,
      tipo: this.tipo,
      fechaRegistro: this.fechaRegistro,
      ultimaSesion: this.ultimaSesion
    }
  }
}
