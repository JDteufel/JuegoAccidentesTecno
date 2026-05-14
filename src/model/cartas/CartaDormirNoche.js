import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta32.png'

export class CartaDormirNoche extends Carta {
  static imagen = imagenCarta

  constructor(horas = 3) {
    super({
      titulo: `Dormir Noche`,
      categorias: [CATEGORIAS_CARTA.BIENESTAR],
      codigo: 'DN',
      detalle: `Noche completa de sueño reparador.`,
      color: '#2c3e50',
      horas: horas,
      tipoHora: 'Bienestar'
    })
  }

  obtenerImagen() {
    return CartaDormirNoche.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
