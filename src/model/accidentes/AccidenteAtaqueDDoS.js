import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente2.svg'

export class AccidenteAtaqueDDoS extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Ataque DDoS',
      codigo: 'DD',
      descripcion: 'Un ataque distribuido satura los servidores de streaming y comunicacion. Los jugadores se refugian en el estudio y la lectura para pasar el tiempo.',
      categoriasAfectadas: [CATEGORIAS_CARTA.ENTRETENIMIENTO],
      categoriasPositivas: [CATEGORIAS_CARTA.ESTUDIO, CATEGORIAS_CARTA.BIENESTAR],
      nivel: 3
    })
  }

  aplicarEfecto(cartasJugador) {
    const resultado = { negativas: [], positivas: [] }
    for (const carta of cartasJugador) {
      if (this.afectaCategoria(carta.categorias)) {
        carta.deshabilitar()
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
    return AccidenteAtaqueDDoS.imagen
  }

  obtenerMensaje() {
    return 'Ataque DDoS: Twitch, YouTube y Discord fuera de linea. Buen momento para estudiar o dormir. Cartas de estudio y sueño recuperadas.'
  }
}
