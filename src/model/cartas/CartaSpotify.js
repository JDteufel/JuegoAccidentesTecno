import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta24.png'

export class CartaSpotify extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: `Spotify`,
      categorias: [CATEGORIAS_CARTA.ENTRETENIMIENTO, CATEGORIAS_CARTA.BIENESTAR],
      codigo: 'SP',
      detalle: `Escucha musica y podcasts para relajarte.`,
      color: '#1db954',
      horas: horas,
      tipoHora: 'Entretenimiento'
    })
  }

  obtenerImagen() {
    return CartaSpotify.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
