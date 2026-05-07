import { ActividadGrupal } from '../ActividadGrupal.js'
import { CATEGORIAS_CARTA } from '../constantes.js'

export class ActividadHackathon extends ActividadGrupal {
  constructor() {
    super({
      nombre: 'Hackathon Grupal',
      codigo: 'HG',
      descripcion: 'Sesion intensiva de programacion en equipo. Recupera 2 horas de trabajo y 1 de estudio.',
      horasBeneficio: 2,
      categoriasBeneficiadas: [CATEGORIAS_CARTA.TRABAJO, CATEGORIAS_CARTA.ESTUDIO]
    })
  }

  obtenerMensaje() {
    return 'Hackathon Grupal: Todos programaron juntos. +2 horas de trabajo. Las cartas de desarrollo se recuperan.'
  }
}
