import { Perfil } from '../Perfil.js'

export class PerfilEspecialistaCloud extends Perfil {
  constructor() {
    super({
      nombre: 'Especialista en Cloud',
      horasPorCategoria: { Trabajo: 4, Estudio: 2 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Administra servicios en la nube.'
    })
  }
}
