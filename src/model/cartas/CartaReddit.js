import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta4.png'

export class CartaReddit extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Reddit',
      categorias: [CATEGORIAS_CARTA.ENTRETENIMIENTO],
      codigo: 'RD',
      detalle: 'Explora comunidades y debates sobre cualquier tema.',
      color: '#ff4500',
      horas: horas,
      tipoHora: 'Entretenimiento'
    })
  }

  obtenerImagen() {
    return CartaReddit.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
