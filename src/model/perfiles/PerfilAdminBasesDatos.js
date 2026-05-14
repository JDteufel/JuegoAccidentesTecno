import { Perfil } from '../Perfil.js'

export class PerfilAdminBasesDatos extends Perfil {
  constructor() {
    super({
      nombre: 'Administrador de Bases de Datos',
      horasPorCategoria: { Trabajo: 4, Estudio: 2 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Administra y optimiza bases de datos.'
    })
  }
}
