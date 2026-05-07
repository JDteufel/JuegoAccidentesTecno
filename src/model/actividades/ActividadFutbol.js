import { ActividadGrupal } from '../ActividadGrupal.js'
import { CATEGORIAS_CARTA } from '../constantes.js'

export class ActividadFutbol extends ActividadGrupal {
  constructor() {
    super({
      nombre: 'Partido de Futbol',
      codigo: 'PF',
      descripcion: 'Todos juegan futbol juntos. Recupera 2 horas de bienestar para todos los jugadores.',
      horasBeneficio: 2,
      categoriasBeneficiadas: [CATEGORIAS_CARTA.BIENESTAR]
    })
  }

  obtenerMensaje() {
    return 'Partido de Futbol: Todos salieron a jugar. +2 horas de bienestar para todos. Las cartas de bienestar deshabilitadas se recuperan.'
  }
}
