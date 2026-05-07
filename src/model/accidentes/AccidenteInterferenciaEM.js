import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente10.svg'

export class AccidenteInterferenciaEM extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Interferencia Electromagnetica',
      codigo: 'IE',
      descripcion: 'Interferencias electromagneticas degradan la senal de red, afectando especialmente las transmisiones en vivo y las videollamadas que requieren conexiones estables.',
      categoriasAfectadas: [CATEGORIAS_CARTA.ENTRETENIMIENTO, CATEGORIAS_CARTA.TRABAJO],
      nivel: 1
    })
  }

  aplicarEfecto(cartasJugador) {
    const cartasAfectadas = []
    for (const carta of cartasJugador) {
      if (this.afectaCategoria(carta.categorias) && carta.estaActiva()) {
        carta.degradar()
        cartasAfectadas.push(carta)
      }
    }
    return cartasAfectadas
  }

  obtenerImagen() {
    return AccidenteInterferenciaEM.imagen
  }

  obtenerMensaje() {
    return 'Interferencia Electromagnetica: Twitch y YouTube experimentan caidas de帧. Las videollamadas en Zoom y Teams tienen audio entrecortado.'
  }
}
