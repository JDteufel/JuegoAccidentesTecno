import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta31.png'

export class CartaCaminar extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: `Caminar`,
      categorias: [CATEGORIAS_CARTA.BIENESTAR],
      codigo: 'CM',
      detalle: `Caminata al aire libre para despejarse.`,
      color: '#2ecc71',
      horas: horas,
      tipoHora: 'Bienestar'
    })
  }

  obtenerImagen() {
    return CartaCaminar.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
