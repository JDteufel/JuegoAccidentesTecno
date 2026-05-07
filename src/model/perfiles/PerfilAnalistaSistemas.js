import { Perfil } from '../Perfil.js'

export class PerfilAnalistaSistemas extends Perfil {
  constructor() {
    super({
      nombre: 'Analista de Sistemas',
      horasRequeridas: 6,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Analiza y optimiza sistemas tecnologicos.'
    })
  }
}
