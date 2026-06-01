import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta16.png'

export class CartaYouTube extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'YouTube',
      categorias: [CATEGORIAS_CARTA.ENTRETENIMIENTO, CATEGORIAS_CARTA.ESTUDIO],
      codigo: 'YT',
      detalle: 'Expone contenido y tutoriales del equipo.',
      color: '#bc4a2c',
      horas: horas,
      tipoHora: 'Entretenimiento'
    })
  }

  obtenerImagen() {
    return CartaYouTube.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
