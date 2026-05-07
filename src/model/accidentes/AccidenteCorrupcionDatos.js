import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente12.svg'

export class AccidenteCorrupcionDatos extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Corrupcion de Datos',
      codigo: 'CD',
      descripcion: 'Los archivos almacenados en la nube y los repositorios de codigo pierden integridad. Documentos en Drive, buckets de AWS y repositorios de GitHub contienen datos corruptos.',
      categoriasAfectadas: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ESTUDIO],
      nivel: 2
    })
  }

  aplicarEfecto(cartasJugador) {
    const cartasAfectadas = []
    for (const carta of cartasJugador) {
      if (this.afectaCategoria(carta.categorias)) {
        if (carta.estaActiva() || carta.degradada) {
          carta.deshabilitar()
          cartasAfectadas.push(carta)
        }
      }
    }
    return cartasAfectadas
  }

  obtenerImagen() {
    return AccidenteCorrupcionDatos.imagen
  }

  obtenerMensaje() {
    return 'Corrupcion de Datos: Archivos en Google Drive y AWS estan corruptos. Los repositorios de GitHub tienen commits inconsistentes.'
  }
}
