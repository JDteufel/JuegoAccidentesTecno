import { Perfil } from '../Perfil.js'

export class PerfilDesarrolladorFullStack extends Perfil {
  constructor() {
    super({
      nombre: 'Desarrollador Full Stack',
      horasPorCategoria: { Trabajo: 5, Estudio: 3 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Desarrolla aplicaciones de extremo a extremo.'
    })
  }
}
