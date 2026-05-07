import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta10.svg'

export class CartaDocker extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: 'Docker',
      categorias: [CATEGORIAS_CARTA.TRABAJO],
      codigo: 'DC',
      detalle: 'Contenedores para aplicaciones.',
      color: '#2496ed',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaDocker.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}

