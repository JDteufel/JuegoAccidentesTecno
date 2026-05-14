import { Perfil } from '../Perfil.js'

export class PerfilAnalistaSistemas extends Perfil {
  constructor() {
    super({
      nombre: 'Analista de Sistemas',
      horasPorCategoria: { Trabajo: 4, Estudio: 2 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Analiza y optimiza sistemas tecnologicos.'
    })
  }
}
