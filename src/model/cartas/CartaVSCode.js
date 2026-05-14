import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta9.png'

export class CartaVSCode extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: 'VS Code',
      categorias: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ESTUDIO],
      codigo: 'VC',
      detalle: 'Edita codigo fuente y depura aplicaciones.',
      color: '#007acc',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaVSCode.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}

