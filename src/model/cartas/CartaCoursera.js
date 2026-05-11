import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta27.png'

export class CartaCoursera extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: `Coursera`,
      categorias: [CATEGORIAS_CARTA.ESTUDIO],
      codigo: 'CR',
      detalle: `Cursos online de universidades top.`,
      color: '#0056d2',
      horas: horas,
      tipoHora: 'Estudio'
    })
  }

  obtenerImagen() {
    return CartaCoursera.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}
