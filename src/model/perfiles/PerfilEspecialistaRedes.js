import { Perfil } from '../Perfil.js'

export class PerfilEspecialistaRedes extends Perfil {
  constructor() {
    super({
      nombre: 'Especialista en Redes',
      horasPorCategoria: { Trabajo: 4, Estudio: 2 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Administra infraestructura de redes.'
    })
  }
}
