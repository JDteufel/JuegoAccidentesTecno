import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta22.png'

export class CartaSlack extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Slack',
      categorias: [CATEGORIAS_CARTA.TRABAJO],
      codigo: 'SL',
      detalle: 'Organiza conversaciones por canales.',
      color: '#845a3a',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaSlack.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}

