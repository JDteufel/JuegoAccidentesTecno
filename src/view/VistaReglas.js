import { VistaListaBase } from './base/VistaListaBase.js'

export class VistaReglas extends VistaListaBase {
  constructor(gui) {
    super(gui)
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

    // Botón "Ver Cartas" - Izquierda
    this.tarjeta.addControl(
      this.crearBoton({
        nombre: 'botonVerCartas',
        texto: 'Ver Cartas',
        top: '260px',
        left: '-160px',
        width: '280px',
        height: '52px',
        fondo: '#3c2d27',
        color: '#ffd6b7',
        callback: () => this.onVerCartasCallback && this.onVerCartasCallback()
      })
    )

    // Botón "Ver Accidentes" - Derecha
    this.tarjeta.addControl(
      this.crearBoton({
        nombre: 'botonVerAccidentes',
        texto: 'Ver Accidentes',
        top: '260px',
        left: '160px',
        width: '280px',
        height: '52px',
        fondo: '#3c2d27',
        color: '#ffd6b7',
        callback: () => this.onVerAccidentesCallback && this.onVerAccidentesCallback()
      })
    )
  }

  onVerCartas(callback) {
    this.onVerCartasCallback = callback
  }

  onVerAccidentes(callback) {
    this.onVerAccidentesCallback = callback
  }
}