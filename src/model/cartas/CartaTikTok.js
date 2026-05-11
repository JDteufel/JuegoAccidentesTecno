import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta26.png'

export class CartaTikTok extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: `TikTok`,
      categorias: [CATEGORIAS_CARTA.ENTRETENIMIENTO],
      codigo: 'TK',
      detalle: `Videos cortos para entretenimiento rapido.`,
      color: '#00f2ea',
      horas: horas,
      tipoHora: 'Entretenimiento'
    })
  }

  obtenerImagen() {
    return CartaTikTok.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}
