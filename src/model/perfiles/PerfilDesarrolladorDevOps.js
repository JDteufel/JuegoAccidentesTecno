import { Perfil } from '../Perfil.js'

export class PerfilDesarrolladorDevOps extends Perfil {
  constructor() {
    super({
      nombre: 'Desarrollador DevOps',
      horasRequeridas: 6,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Automatiza procesos de desarrollo.'
    })
  }
}
