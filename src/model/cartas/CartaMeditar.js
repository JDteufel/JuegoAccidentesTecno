import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta29.svg'

export class CartaMeditar extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: `Meditar`,
      categorias: [CATEGORIAS_CARTA.BIENESTAR],
      codigo: 'MD',
      detalle: `Sesion de meditacion para claridad mental.`,
      color: '#9b59b6',
      horas: horas,
      tipoHora: 'Bienestar'
    })
  }

  obtenerImagen() {
    return CartaMeditar.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}
