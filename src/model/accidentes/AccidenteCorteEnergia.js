import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente8.svg'

export class AccidenteCorteEnergia extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Corte de Energia',
      codigo: 'CE',
      descripcion: 'Un apagon generalizado deja sin electricidad a todos los sistemas tecnologicos. Los jugadores solo pueden hacer actividades al aire libre, dormir o leer.',
      categoriasAfectadas: [
        CATEGORIAS_CARTA.TRABAJO,
        CATEGORIAS_CARTA.ENTRETENIMIENTO,
        CATEGORIAS_CARTA.ESTUDIO
      ],
      categoriasPositivas: [CATEGORIAS_CARTA.BIENESTAR],
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
    return AccidenteCorteEnergia.imagen
  }

  obtenerMensaje() {
    return 'Corte de Energia: TODOS los sistemas tecnologicos fuera de linea. Buen momento para caminar, meditar, dormir o leer. Cartas de bienestar y sueño recuperadas.'
  }
}
