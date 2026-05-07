import { Perfil } from '../Perfil.js'

export class PerfilEspecialistaCloud extends Perfil {
  constructor() {
    super({
      nombre: 'Especialista en Cloud',
      horasRequeridas: 6,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Administra servicios en la nube.'
    })
  }
}
