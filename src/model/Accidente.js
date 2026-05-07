import { CATEGORIAS_ACCIDENTE } from './constantes.js'

export { CATEGORIAS_ACCIDENTE }

export class Accidente {
  constructor({ nombre, codigo, descripcion, categoriasAfectadas, categoriasPositivas, nivel }) {
    this.nombre = nombre
    this.codigo = codigo
    this.descripcion = descripcion
    this.categoriasAfectadas = categoriasAfectadas
    this.categoriasPositivas = categoriasPositivas || []
    this.nivel = nivel
    this.activo = false
  }

  activar() {
    this.activo = true
  }

  desactivar() {
    this.activo = false
  }

  afectaCategoria(categorias) {
    const cats = Array.isArray(categorias) ? categorias : [categorias]
    return cats.some(cat => this.categoriasAfectadas.includes(cat))
  }

  beneficiaCategoria(categorias) {
    const cats = Array.isArray(categorias) ? categorias : [categorias]
    return cats.some(cat => this.categoriasPositivas.includes(cat))
  }

  aplicarEfecto(cartasJugador) {
    const resultado = { negativas: [], positivas: [] }

    for (const carta of cartasJugador) {
      if (this.afectaCategoria(carta.categorias)) {
        switch (this.nivel) {
          case 1:
            if (carta.estaActiva()) {
              carta.degradar()
              resultado.negativas.push(carta)
            }
            break
          case 2:
            if (carta.estaActiva() || carta.degradada) {
              carta.deshabilitar()
              resultado.negativas.push(carta)
            }
            break
          case 3:
            carta.deshabilitar()
            resultado.negativas.push(carta)
            break
        }
      }

      if (this.beneficiaCategoria(carta.categorias)) {
        if (carta.estaDeshabilitada()) {
          carta.activar()
          resultado.positivas.push(carta)
        } else if (carta.degradada) {
          carta.activar()
          resultado.positivas.push(carta)
        }
      }
    }

    return resultado
  }

  obtenerMensaje() {
    return this.descripcion
  }

  obtenerImagen() {
    return null
  }

  toJSON() {
    return {
      tipo: this.constructor.name,
      nombre: this.nombre,
      codigo: this.codigo,
      descripcion: this.descripcion,
      categoriasAfectadas: this.categoriasAfectadas,
      categoriasPositivas: this.categoriasPositivas,
      nivel: this.nivel,
      activo: this.activo
    }
  }

  static fromJSON(json) {
    const accidente = new this(json)
    accidente.activo = json.activo || false
    return accidente
  }
}
