import { Perfil } from '../Perfil.js'

export class PerfilGamer extends Perfil {
  constructor() {
    super({
      nombre: 'Gamer Profesional',
      horasPorCategoria: {
        Entretenimiento: 8,
        Bienestar: 6
      },
      categoriasValidas: ['Entretenimiento', 'Bienestar'],
      descripcion: 'Vive del gaming y streaming. Necesita equilibrio con salud y descanso.'
    })
  }
}
