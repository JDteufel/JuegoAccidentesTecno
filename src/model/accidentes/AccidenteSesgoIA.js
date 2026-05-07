import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente7.svg'

export class AccidenteSesgoIA extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Sesgo de IA',
      codigo: 'SI',
      descripcion: 'Los asistentes de inteligencia artificial integrados en herramientas de desarrollo generan codigo con vulnerabilidades y recomendaciones erroneas que comprometen la integridad del proyecto.',
      categoriasAfectadas: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ESTUDIO],
      nivel: 3
    })
  }

  aplicarEfecto(cartasJugador) {
    const cartasAfectadas = []
    for (const carta of cartasJugador) {
      if (this.afectaCategoria(carta.categorias)) {
        carta.deshabilitar()
        cartasAfectadas.push(carta)
      }
    }
    return cartasAfectadas
  }

  obtenerImagen() {
    return AccidenteSesgoIA.imagen
  }

  obtenerMensaje() {
    return 'Sesgo de IA: GitHub Copilot y las funciones de IA en VS Code han sido desactivadas. El codigo generado contiene errores sistematicos.'
  }
}
