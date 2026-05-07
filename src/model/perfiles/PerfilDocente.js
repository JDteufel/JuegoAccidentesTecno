import { Perfil } from '../Perfil.js'

export class PerfilDocente extends Perfil {
  constructor() {
    super({
      nombre: 'Docente Digital',
      horasPorCategoria: {
        Estudio: 6,
        Trabajo: 6,
        Bienestar: 2
      },
      categoriasValidas: ['Estudio', 'Trabajo', 'Bienestar'],
      descripcion: 'Enseña con herramientas digitales. Preparacion de clases y desarrollo profesional.'
    })
  }
}
