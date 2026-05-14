import { Perfil } from '../Perfil.js'

export class PerfilAnalistaIA extends Perfil {
  constructor() {
    super({
      nombre: 'Analista de IA',
      horasPorCategoria: { Trabajo: 5, Estudio: 3 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Desarrolla modelos de inteligencia artificial.'
    })
  }
}
