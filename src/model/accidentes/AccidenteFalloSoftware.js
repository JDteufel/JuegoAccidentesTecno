import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente5.svg'

export class AccidenteFalloSoftware extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Fallo de Software',
      codigo: 'FS',
      descripcion: 'Un error critico en apps de desarrollo y productividad provoca cierres inesperados. Los jugadores buscan entretenimiento alternativo como Spotify o Netflix.',
      categoriasAfectadas: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ESTUDIO],
      categoriasPositivas: [CATEGORIAS_CARTA.ENTRETENIMIENTO],
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
    return AccidenteFalloSoftware.imagen
  }

  obtenerMensaje() {
    return 'Fallo de Software: VS Code, Figma y Notion con errores. Buen momento para Spotify o Netflix. Cartas de entretenimiento recuperadas.'
  }
}
