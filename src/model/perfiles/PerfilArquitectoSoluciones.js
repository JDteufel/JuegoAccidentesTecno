import { Perfil } from '../Perfil.js'

export class PerfilArquitectoSoluciones extends Perfil {
  constructor() {
    super({
      nombre: 'Arquitecto de Soluciones',
      horasRequeridas: 8,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Disena arquitecturas tecnologicas.'
    })
  }
}
