import { ActividadGrupal } from '../ActividadGrupal.js'
import { CATEGORIAS_CARTA } from '../constantes.js'

export class ActividadPelicula extends ActividadGrupal {
  constructor() {
    super({
      nombre: 'Noche de Peliculas',
      codigo: 'NP',
      descripcion: 'Todos ven una pelicula juntos. Recupera 1 hora de entretenimiento para todos.',
      horasBeneficio: 1,
      categoriasBeneficiadas: [CATEGORIAS_CARTA.ENTRETENIMIENTO]
    })
  }

  obtenerMensaje() {
    return 'Noche de Peliculas: Todos disfrutaron una pelicula. +1 hora de entretenimiento para todos.'
  }
}
