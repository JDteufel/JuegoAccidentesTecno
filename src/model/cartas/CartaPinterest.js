import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta8.svg'

export class CartaPinterest extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Pinterest',
      categorias: [CATEGORIAS_CARTA.ENTRETENIMIENTO, CATEGORIAS_CARTA.ESTUDIO],
      codigo: 'PT',
      detalle: 'Descubre ideas visuales y guarda inspiracion.',
      color: '#e60023',
      horas: horas,
      tipoHora: 'Entretenimiento'
    })
  }

  obtenerImagen() {
    return CartaPinterest.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
