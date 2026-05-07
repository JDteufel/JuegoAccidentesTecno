import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta5.svg'

export class CartaObsidian extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: 'Obsidian',
      categorias: [CATEGORIAS_CARTA.ESTUDIO, CATEGORIAS_CARTA.TRABAJO],
      codigo: 'OB',
      detalle: 'Toma notas y conecta ideas con grafos de conocimiento.',
      color: '#7c3aed',
      horas: horas,
      tipoHora: 'Estudio'
    })
  }

  obtenerImagen() {
    return CartaObsidian.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
