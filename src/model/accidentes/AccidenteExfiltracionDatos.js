import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente15.svg'

export class AccidenteExfiltracionDatos extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Exfiltracion de Datos',
      codigo: 'ED',
      descripcion: 'Un actor malicioso extrae datos confidenciales de los sistemas de almacenamiento cloud y herramientas de gestion. Documentos en Drive, buckets de AWS y tableros de Jira y Trello han sido accedidos sin autorizacion.',
      categoriasAfectadas: [CATEGORIAS_CARTA.TRABAJO],
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
    return AccidenteExfiltracionDatos.imagen
  }

  obtenerMensaje() {
    return 'Exfiltracion de Datos: Se detecto acceso no autorizado a Google Drive, AWS, Jira y Trello. Todos los datos sensibles se consideran comprometidos.'
  }
}
