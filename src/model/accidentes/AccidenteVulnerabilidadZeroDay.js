import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente13.svg'

export class AccidenteVulnerabilidadZeroDay extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Vulnerabilidad Zero-Day',
      codigo: 'ZD',
      descripcion: 'Una vulnerabilidad desconocida es explotada en herramientas de desarrollo y servicios cloud. CVEs criticos afectan Docker, Kubernetes, GitHub y VS Code antes de que existan parches disponibles.',
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
    return AccidenteVulnerabilidadZeroDay.imagen
  }

  obtenerMensaje() {
    return 'Vulnerabilidad Zero-Day: CVEs criticos detectados en Docker, Kubernetes, GitHub y VS Code. No hay parches disponibles. Sistemas aislados preventivamente.'
  }
}
