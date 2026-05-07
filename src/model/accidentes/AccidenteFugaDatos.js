import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente3.svg'

export class AccidenteFugaDatos extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Fuga de Datos',
      codigo: 'FD',
      descripcion: 'Informacion sensible se filtra al exterior a traves de servicios de almacenamiento en la nube y herramientas de gestion de proyectos que contienen datos confidenciales.',
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
    return AccidenteFugaDatos.imagen
  }

  obtenerMensaje() {
    return 'Fuga de Datos: Google Drive, AWS, Jira y Trello han sido bloqueados por contener informacion sensible expuesta.'
  }
}
