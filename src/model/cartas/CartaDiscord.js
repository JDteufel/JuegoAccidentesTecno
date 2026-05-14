import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta2.png'

export class CartaDiscord extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Discord',
      categorias: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ENTRETENIMIENTO],
      codigo: 'DS',
      detalle: 'Coordina mensajes y actividades grupales.',
      color: '#b95a2e',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaDiscord.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
