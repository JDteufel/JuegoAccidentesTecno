import { CATEGORIAS_CARTA } from './constantes.js'

export { CATEGORIAS_CARTA }

export class Carta {
  constructor({ titulo, categorias, codigo, detalle, color, horas = 1, tipo = 'actividad', tipoHora = null }) {
    this.titulo = titulo
    this.categorias = Array.isArray(categorias) ? categorias : [categorias]
    this.codigo = codigo
    this.detalle = detalle
    this.color = color
    this.horas = horas
    this.tipo = tipo
    this.tipoHora = tipoHora
    this.estado = 'activa'
    this.degradada = false
  }

  aplicarHoras(perfil) {
    if (this.estaDeshabilitada()) return 0
    const horasAplicadas = this.degradada ? Math.ceil(this.horas / 2) : this.horas
    perfil.agregarHoras(horasAplicadas, this.tipoHora)
    return horasAplicadas
  }

  activar() {
    this.estado = 'activa'
    this.degradada = false
  }

  degradar() {
    if (this.estaDeshabilitada()) return
    this.estado = 'degradada'
    this.degradada = true
  }

  deshabilitar() {
    this.estado = 'deshabilitada'
  }

  estaActiva() {
    return this.estado === 'activa'
  }

  estaDeshabilitada() {
    return this.estado === 'deshabilitada'
  }

  getColor() {
    return this.color
  }

  obtenerImagen() {
    return null
  }

  obtenerDescripcion() {
    return this.detalle
  }

  toJSON() {
    return {
      tipo: this.constructor.name,
      titulo: this.titulo,
      categorias: this.categorias,
      codigo: this.codigo,
      detalle: this.detalle,
      color: this.color,
      horas: this.horas,
      tipoHora: this.tipoHora,
      estado: this.estado,
      degradada: this.degradada
    }
  }

  static fromJSON(json) {
    const carta = new this(json)
    carta.estado = json.estado || 'activa'
    carta.degradada = json.degradada || false
    return carta
  }
}
