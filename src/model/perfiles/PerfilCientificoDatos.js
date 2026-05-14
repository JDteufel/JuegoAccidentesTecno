import { Perfil } from '../Perfil.js'

export class PerfilCientificoDatos extends Perfil {
  constructor() {
    super({
      nombre: 'Cientifico de Datos',
      horasPorCategoria: { Trabajo: 5, Estudio: 3 },
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Analiza datos y crea modelos predictivos.'
    })
  }
}
