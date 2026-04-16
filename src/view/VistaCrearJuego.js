import { VistaListaBase } from './base/VistaListaBase.js'

export class VistaCrearJuego extends VistaListaBase {
  constructor(gui) {
    super(gui)
    this.onEntrarCallback = null
  }

  obtenerConfiguracionLista() {
    return {
      nombreOverlay: 'pantallaCrearJuego',
      nombreTarjeta: 'tarjetaCrearJuego',
      nombreTitulo: 'tituloCrearJuego',
      titulo: 'Crear Juego',
      prefijoItems: 'crearJuegoItem',
      items: [
        'Codigo del lobby: ABC123',
        'Jugadores conectados: Juan, Ana, Invitado 1',
        'Partida 1: 2 jugadores',
        'Partida 2: 1 jugador'
      ],
      nombreBotonVolver: 'crearJuegoVolver'
    }
  }

  crear() {
    super.crear()

    this.tarjeta.addControl(
      this.crearBoton({
        nombre: 'botonEntrar',
        texto: 'Entrar',
        top: '260px',
        fondo: '#3c2d27',
        color: '#ffd6b7',
        callback: () => this.onEntrarCallback && this.onEntrarCallback()
      })
    )
  }

  onEntrar(callback) {
    this.onEntrarCallback = callback
  }
}
