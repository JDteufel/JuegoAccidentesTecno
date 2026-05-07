import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente9.svg'

export class AccidentePhishingMasivo extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Phishing Masivo',
      codigo: 'PM',
      descripcion: 'Una campana masiva de phishing utiliza plataformas de comunicacion como vector. Los jugadores desconectan de redes y buscan actividades al aire libre.',
      categoriasAfectadas: [CATEGORIAS_CARTA.TRABAJO],
      categoriasPositivas: [CATEGORIAS_CARTA.BIENESTAR, CATEGORIAS_CARTA.ESTUDIO],
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
    return AccidentePhishingMasivo.imagen
  }

  obtenerMensaje() {
    return 'Phishing Masivo: Discord, Teams, Zoom y Slack suspendidos. Buen momento para meditar o estudiar. Cartas de bienestar y estudio recuperadas.'
  }
}
