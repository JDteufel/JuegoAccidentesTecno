import { Carta } from '../Carta.js'
import { CATEGORIAS_CARTA } from '../constantes.js'
import imagenCarta from '../../assets/cartas/carta11.png'

export class CartaKubernetes extends Carta {
  static imagen = imagenCarta

  constructor(horas = 2) {
    super({
      titulo: 'Kubernetes',
      categorias: [CATEGORIAS_CARTA.TRABAJO],
      codigo: 'K8',
      detalle: 'Orquesta contenedores.',
      color: '#326ce5',
      horas: horas,
      tipoHora: 'Trabajo'
    })
  }

  obtenerImagen() {
    return CartaKubernetes.imagen
  }

  aplicarHoras(perfil) {
    if (!perfil.cartaEsValida(this.categorias)) return 0
    return super.aplicarHoras(perfil)
  }
}
