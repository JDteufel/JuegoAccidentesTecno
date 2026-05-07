import { Perfil } from '../Perfil.js'

export class PerfilEstudiante extends Perfil {
  constructor() {
    super({
      nombre: 'Estudiante Universitario',
      horasPorCategoria: {
        Estudio: 8,
        Entretenimiento: 4,
        Bienestar: 4
      },
      categoriasValidas: ['Estudio', 'Entretenimiento', 'Bienestar'],
      descripcion: 'Balancea estudio con vida social y descanso. Necesita horas en todas las areas.'
    })
  }
}
