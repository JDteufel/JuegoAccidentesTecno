import { Perfil } from '../Perfil.js'

export class PerfilEspecialistaSeguridad extends Perfil {
  constructor() {
    super({
      nombre: 'Especialista en Seguridad',
      horasPorCategoria: { Trabajo: 4, Estudio: 2 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Protege sistemas de amenazas.'
    })
  }
}
