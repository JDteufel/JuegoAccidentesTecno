import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta28.png'

export class CartaDuolingo extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: `Duolingo`,
      categorias: [CATEGORIAS_CARTA.ESTUDIO],
      codigo: 'DL',
      detalle: `Aprende idiomas de forma divertida.`,
      color: '#58cc02',
      horas: horas,
      tipoHora: 'Estudio'
    })
  }

  obtenerImagen() {
    return CartaDuolingo.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}
