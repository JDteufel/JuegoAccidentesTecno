import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta7.svg'

export class CartaTwitter extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Twitter',
      categorias: [CATEGORIAS_CARTA.ENTRETENIMIENTO, CATEGORIAS_CARTA.TRABAJO],
      codigo: 'TW',
      detalle: 'Red social de noticias y opiniones en tiempo real.',
      color: '#1da1f2',
      horas: horas,
      tipoHora: 'Entretenimiento'
    })
  }

  obtenerImagen() {
    return CartaTwitter.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
