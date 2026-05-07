import { Perfil } from '../Perfil.js'

export class PerfilCientificoDatos extends Perfil {
  constructor() {
    super({
      nombre: 'Cientifico de Datos',
      horasRequeridas: 8,
      categoriasValidas: ['Trabajo', 'Estudio'],
      descripcion: 'Analiza datos y crea modelos predictivos.'
    })
  }
}
