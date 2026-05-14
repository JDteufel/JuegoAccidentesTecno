import { Perfil } from '../Perfil.js'

export class PerfilDesarrolladorDevOps extends Perfil {
  constructor() {
    super({
      nombre: 'Desarrollador DevOps',
      horasPorCategoria: { Trabajo: 4, Estudio: 2 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Automatiza procesos de desarrollo.'
    })
  }
}
