import { Perfil } from '../Perfil.js'

export class PerfilIngenieroSoftware extends Perfil {
  constructor() {
    super({
      nombre: 'Ingeniero de Software',
      horasRequeridas: 8,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Diseña y desarrolla soluciones software.'
    })
  }
}
