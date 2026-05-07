import { Perfil } from '../Perfil.js'

export class PerfilDesarrolladorFullStack extends Perfil {
  constructor() {
    super({
      nombre: 'Desarrollador Full Stack',
      horasRequeridas: 8,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Desarrolla aplicaciones de extremo a extremo.'
    })
  }
}
