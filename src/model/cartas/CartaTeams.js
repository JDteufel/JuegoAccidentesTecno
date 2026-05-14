import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta12.png'

export class CartaTeams extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Teams',
      categorias: [CATEGORIAS_CARTA.TRABAJO],
      codigo: 'TM',
      detalle: 'Colabora en reuniones y chats.',
      color: '#6264a7',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaTeams.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}

