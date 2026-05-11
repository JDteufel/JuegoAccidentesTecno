import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente14.png'

export class AccidenteFalloActualizacion extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Fallo de Actualizacion',
      codigo: 'FA',
      descripcion: 'Una actualizacion defectuosa rompe la funcionalidad de herramientas de desarrollo y productividad. VS Code, Figma y Notion presentan incompatibilidades tras la ultima actualizacion.',
      categoriasAfectadas: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ESTUDIO],
      nivel: 1
    })
  }

  aplicarEfecto(cartasJugador) {
    const cartasAfectadas = []
    for (const carta of cartasJugador) {
      if (this.afectaCategoria(carta.categorias) && carta.estaActiva()) {
        carta.degradar()
        cartasAfectadas.push(carta)
      }
    }
    return cartasAfectadas
  }

  obtenerImagen() {
    return AccidenteFalloActualizacion.imagen
  }

  obtenerMensaje() {
    return 'Fallo de Actualizacion: La ultima version de VS Code, Figma y Notion causa errores. Se recomienda volver a la version anterior.'
  }
}
