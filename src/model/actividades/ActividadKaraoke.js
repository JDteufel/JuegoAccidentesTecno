import { ActividadGrupal } from '../ActividadGrupal.js'
import { CATEGORIAS_CARTA } from '../constantes.js'

export class ActividadKaraoke extends ActividadGrupal {
  constructor() {
    super({
      nombre: 'Noche de Karaoke',
      codigo: 'KK',
      descripcion: 'Todos cantan y se divierten. Recupera 1 hora de entretenimiento y 1 de social.',
      horasBeneficio: 1,
      categoriasBeneficiadas: [CATEGORIAS_CARTA.ENTRETENIMIENTO, CATEGORIAS_CARTA.BIENESTAR]
    })
  }

  obtenerMensaje() {
    return 'Noche de Karaoke: Todos cantaron juntos. +1 hora de entretenimiento y social. Buen ambiente grupal.'
  }
}
