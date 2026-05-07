import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente16.svg'

export class AccidenteFalloAutenticacion extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Fallo de Autenticacion',
      codigo: 'FAU',
      descripcion: 'El sistema de autenticacion centralizado falla, impidiendo el acceso a todas las plataformas que requieren inicio de sesion. Teams, Zoom, Drive, Jira y Trello no pueden verificar identidades.',
      categoriasAfectadas: [CATEGORIAS_CARTA.TRABAJO],
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
    return AccidenteFalloAutenticacion.imagen
  }

  obtenerMensaje() {
    return 'Fallo de Autenticacion: El servidor de identidades no responde. Teams, Zoom, Google Drive, Jira y Trello rechazan todos los intentos de inicio de sesion.'
  }
}
