import { Perfil } from '../Perfil.js'

export class PerfilAnalistaIA extends Perfil {
  constructor() {
    super({
      nombre: 'Analista de IA',
      horasRequeridas: 8,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Desarrolla modelos de inteligencia artificial.'
    })
  }
}
