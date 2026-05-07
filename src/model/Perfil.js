export class Perfil {
  constructor({ nombre, horasPorCategoria, categoriasValidas, descripcion }) {
    this.nombre = nombre
    this.horasPorCategoria = horasPorCategoria || {}
    this.categoriasValidas = categoriasValidas
    this.descripcion = descripcion
    this.horasCompletadasPorCategoria = {}
    this.completado = false

    Object.keys(this.horasPorCategoria).forEach(cat => {
      this.horasCompletadasPorCategoria[cat] = 0
    })
  }

  get horasRequeridas() {
    return Object.values(this.horasPorCategoria).reduce((sum, h) => sum + h, 0)
  }

  get horasCompletadas() {
    return Object.values(this.horasCompletadasPorCategoria).reduce((sum, h) => sum + h, 0)
  }

  agregarHoras(horas, tipoHora) {
    const tipo = tipoHora || Object.keys(this.horasPorCategoria)[0]
    if (this.horasCompletadasPorCategoria[tipo] !== undefined) {
      const maximo = this.horasPorCategoria[tipo]
      const actual = this.horasCompletadasPorCategoria[tipo]
      this.horasCompletadasPorCategoria[tipo] = Math.min(actual + horas, maximo)
    }
    this.verificarCompletado()
  }

  verificarCompletado() {
    this.completado = Object.keys(this.horasPorCategoria).every(cat => {
      return this.horasCompletadasPorCategoria[cat] >= this.horasPorCategoria[cat]
    })
  }

  getProgreso() {
    const totalRequerido = this.horasRequeridas
    if (totalRequerido === 0) return 0
    return Math.min(this.horasCompletadas / totalRequerido, 1)
  }

  getProgresoPorCategoria(tipoHora) {
    const requerido = this.horasPorCategoria[tipoHora] || 0
    if (requerido === 0) return 0
    const completado = this.horasCompletadasPorCategoria[tipoHora] || 0
    return Math.min(completado / requerido, 1)
  }

  cartaEsValida(categorias) {
    const cats = Array.isArray(categorias) ? categorias : [categorias]
    return cats.some(cat => this.categoriasValidas.includes(cat))
  }

  reset() {
    Object.keys(this.horasCompletadasPorCategoria).forEach(cat => {
      this.horasCompletadasPorCategoria[cat] = 0
    })
    this.completado = false
  }

  toJSON() {
    return {
      tipo: this.constructor.name,
      nombre: this.nombre,
      horasPorCategoria: this.horasPorCategoria,
      categoriasValidas: this.categoriasValidas,
      descripcion: this.descripcion,
      horasCompletadasPorCategoria: this.horasCompletadasPorCategoria,
      completado: this.completado
    }
  }

  static fromJSON(json) {
    const perfil = new this(json)
    perfil.horasCompletadasPorCategoria = json.horasCompletadasPorCategoria || {}
    perfil.completado = json.completado || false
    Object.keys(perfil.horasPorCategoria).forEach(cat => {
      if (perfil.horasCompletadasPorCategoria[cat] === undefined) {
        perfil.horasCompletadasPorCategoria[cat] = 0
      }
    })
    return perfil
  }
}
