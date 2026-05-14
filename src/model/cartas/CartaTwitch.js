import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta17.png'

export class CartaTwitch extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Twitch',
      categorias: [CATEGORIAS_CARTA.ENTRETENIMIENTO],
      codigo: 'TW',
      detalle: 'Activa eventos en vivo e interacciones.',
      color: '#7d4d31',
      horas: horas,
      tipoHora: 'Entretenimiento'
    })
  }

  obtenerImagen() {
    return CartaTwitch.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}

