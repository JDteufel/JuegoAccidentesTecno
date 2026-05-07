import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta3.svg'

export class CartaLinkedIn extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'LinkedIn',
      categorias: [CATEGORIAS_CARTA.TRABAJO],
      codigo: 'LI',
      detalle: 'Conecta con profesionales y busca oportunidades laborales.',
      color: '#0a66c2',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaLinkedIn.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
