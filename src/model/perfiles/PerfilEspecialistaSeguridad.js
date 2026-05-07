import { Perfil } from '../Perfil.js'

export class PerfilEspecialistaSeguridad extends Perfil {
  constructor() {
    super({
      nombre: 'Especialista en Seguridad',
      horasRequeridas: 6,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Protege sistemas de amenazas.'
    })
  }
}
