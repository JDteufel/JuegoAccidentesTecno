import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente1.svg'

export class AccidenteSobrecargaRed extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Sobrecarga de Red',
      codigo: 'SR',
      descripcion: 'La saturacion del ancho de banda provoca la caida de llamadas y transmisiones. Mientras tanto, actividades al aire libre como caminar o meditar se vuelven mas atractivas.',
      categoriasAfectadas: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ENTRETENIMIENTO],
      categoriasPositivas: [CATEGORIAS_CARTA.BIENESTAR],
      nivel: 1
    })
  }

  aplicarEfecto(cartasJugador) {
    const resultado = { negativas: [], positivas: [] }
    for (const carta of cartasJugador) {
      if (this.afectaCategoria(carta.categorias) && carta.estaActiva()) {
        carta.degradar()
        resultado.negativas.push(carta)
      }
      if (this.beneficiaCategoria(carta.categorias)) {
        if (carta.estaDeshabilitada()) {
          carta.activar()
          resultado.positivas.push(carta)
        } else if (carta.degradada) {
          carta.activar()
          resultado.positivas.push(carta)
        }
      }
    }
    return resultado
  }

  obtenerImagen() {
    return AccidenteSobrecargaRed.imagen
  }

  obtenerMensaje() {
    return 'Sobrecarga de Red: Discord, Teams, Zoom y Twitch tienen rendimiento reducido. Buen momento para caminar o meditar. Cartas de bienestar recuperadas.'
  }
}
