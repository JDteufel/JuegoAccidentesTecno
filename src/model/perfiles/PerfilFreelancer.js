import { Perfil } from '../Perfil.js'

export class PerfilFreelancer extends Perfil {
  constructor() {
    super({
      nombre: 'Freelancer Digital',
      horasPorCategoria: {
        Trabajo: 8,
        Bienestar: 4,
        Estudio: 2
      },
      categoriasValidas: ['Trabajo', 'Bienestar', 'Estudio'],
      descripcion: 'Trabaja por cuenta propia. Debe equilibrar proyectos con autocuidado.'
    })
  }
}
