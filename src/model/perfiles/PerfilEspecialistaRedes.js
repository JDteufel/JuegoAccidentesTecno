import { Perfil } from '../Perfil.js'

export class PerfilEspecialistaRedes extends Perfil {
  constructor() {
    super({
      nombre: 'Especialista en Redes',
      horasRequeridas: 6,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Administra infraestructura de redes.'
    })
  }
}
