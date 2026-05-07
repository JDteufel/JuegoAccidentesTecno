import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta33.svg'

export class CartaSiesta extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: `Siesta`,
      categorias: [CATEGORIAS_CARTA.BIENESTAR],
      codigo: 'ST',
      detalle: `Siesta rapida para recuperar energia.`,
      color: '#34495e',
      horas: horas,
      tipoHora: 'Bienestar'
    })
  }

  obtenerImagen() {
    return CartaSiesta.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}
