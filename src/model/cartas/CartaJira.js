import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta18.png'

export class CartaJira extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Jira',
      categorias: [CATEGORIAS_CARTA.TRABAJO],
      codigo: 'JR',
      detalle: 'Gestiona proyectos y seguimiento de tareas.',
      color: '#6b4c3a',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaJira.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}

