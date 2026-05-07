import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta34.svg'

export class CartaLeer extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: `Leer`,
      categorias: [CATEGORIAS_CARTA.ESTUDIO, CATEGORIAS_CARTA.ENTRETENIMIENTO],
      codigo: 'LR',
      detalle: `Lectura de libro o articulo tecnico.`,
      color: '#e67e22',
      horas: horas,
      tipoHora: 'Estudio'
    })
  }

  obtenerImagen() {
    return CartaLeer.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}
