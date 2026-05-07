import { Perfil } from '../Perfil.js'

export class PerfilAdminBasesDatos extends Perfil {
  constructor() {
    super({
      nombre: 'Administrador de Bases de Datos',
      horasRequeridas: 6,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Administra y optimiza bases de datos.'
    })
  }
}
