import { Perfil } from '../Perfil.js'

export class PerfilArquitectoSoluciones extends Perfil {
  constructor() {
    super({
      nombre: 'Arquitecto de Soluciones',
      horasPorCategoria: { Trabajo: 5, Estudio: 3 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Disena arquitecturas tecnologicas.'
    })
  }
}
