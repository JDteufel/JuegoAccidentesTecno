import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta23.png'

export class CartaComodin extends Carta {
  static imagen = imagenCarta

  constructor({ titulo, categorias, codigo, detalle, color, horas = 1 }) {
    super({
      titulo,
      categorias: categorias || [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ENTRETENIMIENTO, CATEGORIAS_CARTA.ESTUDIO, CATEGORIAS_CARTA.BIENESTAR],
      codigo,
      detalle,
      color,
      horas,
      tipo: 'comodin'
    })
  }

  obtenerImagen() {
    return CartaComodin.imagen
  }

  aplicarHoras(perfil) {
    return super.aplicarHoras(perfil)
  }

  cartaEsValidaParaPerfil(perfil) {
    return true
  }
}

