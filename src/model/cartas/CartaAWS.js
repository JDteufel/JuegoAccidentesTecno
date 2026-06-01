import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta15.png'

export class CartaAWS extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: 'AWS',
      categorias: [CATEGORIAS_CARTA.TRABAJO],
      codigo: 'AWS',
      detalle: 'Proporciona servicios en la nube.',
      color: '#ff9900',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaAWS.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
