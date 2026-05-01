import { VistaListaBase } from './base/VistaListaBase.js'

export class VistaReglas extends VistaListaBase {
  constructor() {
    super()
    this.onVerCartasCallback = null
    this.onVerAccidentesCallback = null
  }

  obtenerConfiguracionLista() {
    return {
      nombreOverlay: 'pantallaReglas',
      nombreTarjeta: 'tarjetaReglas',
      nombreTitulo: 'tituloReglas',
      titulo: 'Reglas del Juego',
      prefijoItems: 'regla',
      items: [
        'Cada jugador recibe un perfil y cartas iniciales.',
        'Las cartas completan horas o actividades válidas para cada perfil.',
        'Los accidentes tecnológicos pueden debilitar o inhabilitar cartas.',
        'La partida termina cuando todos los perfiles se completan.'
      ],
      nombreBotonVolver: 'reglasVolver'
    }
  }

  crear() {
    super.crear()

    const buttonsRow = document.createElement('div')
    buttonsRow.style.cssText = `
      display: flex;
      gap: 20px;
      margin-top: 15px;
    `
    this.tarjetaEl.appendChild(buttonsRow)

    const btnCartas = this._crearBoton(
      'Ver Cartas',
      '#3c2d27',
      '#ffd6b7',
      () => this.onVerCartasCallback && this.onVerCartasCallback()
    )
    btnCartas.style.width = '280px'
    buttonsRow.appendChild(btnCartas)

    const btnAccidentes = this._crearBoton(
      'Ver Accidentes',
      '#3c2d27',
      '#ffd6b7',
      () => this.onVerAccidentesCallback && this.onVerAccidentesCallback()
    )
    btnAccidentes.style.width = '280px'
    buttonsRow.appendChild(btnAccidentes)
  }

  onVerCartas(callback) {
    this.onVerCartasCallback = callback
  }

  onVerAccidentes(callback) {
    this.onVerAccidentesCallback = callback
  }
}
