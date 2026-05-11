import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente11.png'

export class AccidenteFalloNube extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Fallo en la Nube',
      codigo: 'FN',
      descripcion: 'Una interrupcion masiva en servicios cloud afecta almacenamiento y gestion de proyectos. Los jugadores se enfocan en entretenimiento local y bienestar.',
      categoriasAfectadas: [CATEGORIAS_CARTA.TRABAJO],
      categoriasPositivas: [CATEGORIAS_CARTA.ENTRETENIMIENTO, CATEGORIAS_CARTA.BIENESTAR],
      nivel: 2
    })
  }

  aplicarEfecto(cartasJugador) {
    const resultado = { negativas: [], positivas: [] }
    for (const carta of cartasJugador) {
      if (this.afectaCategoria(carta.categorias)) {
        if (carta.estaActiva() || carta.degradada) {
          carta.deshabilitar()
          resultado.negativas.push(carta)
        }
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
    return AccidenteFalloNube.imagen
  }

  obtenerMensaje() {
    return 'Fallo en la Nube: AWS y Google Drive no responden. Jira y Trello no sincronizan. Buen momento para Netflix o futbol. Cartas de entretenimiento y bienestar recuperadas.'
  }
}
