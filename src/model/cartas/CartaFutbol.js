import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta30.svg'

export class CartaFutbol extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: `Futbol`,
      categorias: [CATEGORIAS_CARTA.BIENESTAR],
      codigo: 'FB',
      detalle: `Partido de futbol con amigos.`,
      color: '#27ae60',
      horas: horas,
      tipoHora: 'Bienestar'
    })
  }

  obtenerImagen() {
    return CartaFutbol.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}
