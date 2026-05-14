import { Perfil } from '../Perfil.js'

export class PerfilIngenieroSoftware extends Perfil {
  constructor() {
    super({
      nombre: 'Ingeniero de Software',
      horasPorCategoria: { Trabajo: 5, Estudio: 3 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Diseña y desarrolla soluciones software.'
    })
  }
}
