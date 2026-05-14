import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta1.png'

export class CartaGitHub extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: 'GitHub',
      categorias: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ESTUDIO],
      codigo: 'GH',
      detalle: 'Versiona tareas y coordina entregas.',
      color: '#d66a1f',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaGitHub.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
