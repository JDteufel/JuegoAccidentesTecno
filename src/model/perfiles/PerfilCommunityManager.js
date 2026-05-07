import { Perfil } from '../Perfil.js'

export class PerfilCommunityManager extends Perfil {
  constructor() {
    super({
      nombre: 'Community Manager',
      horasPorCategoria: {
        Trabajo: 8,
        Entretenimiento: 4,
        Bienestar: 2
      },
      categoriasValidas: ['Trabajo', 'Entretenimiento', 'Bienestar'],
      descripcion: 'Gestiona redes sociales profesionalmente. El entretenimiento tambien es trabajo.'
    })
  }
}
