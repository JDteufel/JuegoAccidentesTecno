import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta14.svg'

export class CartaGoogleDrive extends Carta {
  static imagen = imagenCarta

  constructor(horas = 1) {
    super({
      titulo: 'Google Drive',
      categorias: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ESTUDIO],
      codigo: 'GD',
      detalle: 'Respalda archivos y comparte recursos.',
      color: '#cf8a34',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaGoogleDrive.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categoria)) return 0
    return super.aplicarHoras(perfil)
  }
}

