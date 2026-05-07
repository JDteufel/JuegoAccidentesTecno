import { Accidente } from '../Accidente.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenAccidente from '../../assets/accidentes/accidente4.svg'

export class AccidenteAtaqueSeguridad extends Accidente {
  static imagen = imagenAccidente

  constructor() {
    super({
      nombre: 'Ataque de Seguridad',
      codigo: 'AS',
      descripcion: 'Un ataque dirigido compromete las plataformas de comunicacion y almacenamiento en la nube, utilizadas como vectores de intrusion al sistema.',
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
    return AccidenteAtaqueSeguridad.imagen
  }

  obtenerMensaje() {
    return 'Ataque de Seguridad: Teams, Slack, Google Drive y AWS han sido comprometidos. Acceso restringido hasta nueva notificacion.'
  }
}
