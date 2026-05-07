import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente6.svg'

export class AccidenteFalloHardware extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Fallo de Hardware',
      codigo: 'FH',
      descripcion: 'Una averia en los servidores fisicos afecta la infraestructura de contenedores y orquestacion. Docker y Kubernetes dependen de hardware funcional para operar.',
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
    return AccidenteFalloHardware.imagen
  }

  obtenerMensaje() {
    return 'Fallo de Hardware: Los servidores que ejecutan Docker y Kubernetes han fallado. Los contenedores no pueden iniciarse.'
  }
}
