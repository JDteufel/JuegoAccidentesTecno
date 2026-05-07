import { ActividadGrupal } from '../ActividadGrupal.js'
import { CATEGORIAS_CARTA } from '../constantes.js'

export class ActividadEstudioGrupal extends ActividadGrupal {
  constructor() {
    super({
      nombre: 'Estudio Grupal',
      codigo: 'EG',
      descripcion: 'Sesion de estudio colaborativo. Recupera 2 horas de estudio para todos.',
      horasBeneficio: 2,
      categoriasBeneficiadas: [CATEGORIAS_CARTA.ESTUDIO]
    })
  }

  obtenerMensaje() {
    return 'Estudio Grupal: Todos estudiaron juntos. +2 horas de estudio. Las cartas de estudio se recuperan.'
  }
}
