export class ActividadGrupal {
  constructor({ nombre, codigo, descripcion, horasBeneficio, categoriasBeneficiadas }) {
    this.nombre = nombre
    this.codigo = codigo
    this.descripcion = descripcion
    this.horasBeneficio = horasBeneficio
    this.categoriasBeneficiadas = categoriasBeneficiadas
    this.activa = false
  }

  activar() {
    this.activa = true
  }

  desactivar() {
    this.activa = false
  }

  beneficiaCategoria(categorias) {
    const cats = Array.isArray(categorias) ? categorias : [categorias]
    return cats.some(cat => this.categoriasBeneficiadas.includes(cat))
  }

  aplicarBeneficio(cartasJugador, perfil) {
    const cartasBeneficiadas = []
    for (const carta of cartasJugador) {
      if (this.beneficiaCategoria(carta.categorias)) {
        if (carta.estaDeshabilitada()) {
          carta.activar()
          cartasBeneficiadas.push(carta)
        } else if (carta.degradada) {
          carta.activar()
          cartasBeneficiadas.push(carta)
        }
      }
    }
    perfil.agregarHoras(this.horasBeneficio, Object.keys(perfil.horasPorCategoria)[0])
    return cartasBeneficiadas
  }

  obtenerMensaje() {
    return this.descripcion
  }

  toJSON() {
    return {
      tipo: this.constructor.name,
      nombre: this.nombre,
      codigo: this.codigo,
      descripcion: this.descripcion,
      horasBeneficio: this.horasBeneficio,
      categoriasBeneficiadas: this.categoriasBeneficiadas,
      activa: this.activa
    }
  }

  static fromJSON(json) {
    const actividad = new this(json)
    actividad.activa = json.activa || false
    return actividad
  }
}
