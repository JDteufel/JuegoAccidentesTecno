import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta25.svg'

export class CartaNetflix extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: `Netflix`,
      categorias: [CATEGORIAS_CARTA.ENTRETENIMIENTO],
      codigo: 'NF',
      detalle: `Ve series y peliculas para desconectar.`,
      color: '#e50914',
      horas: horas,
      tipoHora: 'Entretenimiento'
    })
  }

  obtenerImagen() {
    return CartaNetflix.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}
