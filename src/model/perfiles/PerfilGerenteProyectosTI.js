import { Perfil } from '../Perfil.js'

export class PerfilGerenteProyectosTI extends Perfil {
  constructor() {
    super({
      nombre: 'Gerente de Proyectos TI',
      horasPorCategoria: { Trabajo: 3, Bienestar: 1, Estudio: 2 },
      categoriasValidas: ['Trabajo', 'Bienestar', 'Estudio'],
      descripcion: 'Lidera proyectos tecnologicos.'
    })
  }
}
