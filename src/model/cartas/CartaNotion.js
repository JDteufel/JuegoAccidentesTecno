import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta20.png'

export class CartaNotion extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Notion',
      categorias: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ESTUDIO],
      codigo: 'NT',
      detalle: 'Crea documentos y bases de conocimiento.',
      color: '#5a4a3a',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaNotion.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
