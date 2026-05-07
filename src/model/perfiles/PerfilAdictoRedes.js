import { Perfil } from '../Perfil.js'

export class PerfilAdictoRedes extends Perfil {
  constructor() {
    super({
      nombre: 'Adicto a Redes',
      horasPorCategoria: {
        Entretenimiento: 8,
        Bienestar: 4
      },
      categoriasValidas: ['Entretenimiento', 'Bienestar'],
      descripcion: 'Vive conectado a redes sociales. Necesita equilibrar entretenimiento con bienestar.'
    })
  }
}
