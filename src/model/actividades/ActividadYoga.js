import { ActividadGrupal } from '../ActividadGrupal.js'
import { CATEGORIAS_CARTA } from '../constantes.js'

export class ActividadYoga extends ActividadGrupal {
  constructor() {
    super({
      nombre: 'Sesion de Yoga',
      codigo: 'YG',
      descripcion: 'Todos hacen yoga y meditacion grupal. Recupera 2 horas de bienestar y 1 de sueño.',
      horasBeneficio: 2,
      categoriasBeneficiadas: [CATEGORIAS_CARTA.BIENESTAR]
    })
  }

  obtenerMensaje() {
    return 'Sesion de Yoga: Todos meditaron juntos. +2 horas de bienestar. Las cartas de bienestar se recuperan.'
  }
}
