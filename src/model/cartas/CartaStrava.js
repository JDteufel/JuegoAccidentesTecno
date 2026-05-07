import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta6.svg'

export class CartaStrava extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Strava',
      categorias: [CATEGORIAS_CARTA.BIENESTAR],
      codigo: 'SV',
      detalle: 'Registra carreras y ciclismo con seguimiento GPS.',
      color: '#fc4c02',
      horas: horas,
      tipoHora: 'Bienestar'
    })
  }

  obtenerImagen() {
    return CartaStrava.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
