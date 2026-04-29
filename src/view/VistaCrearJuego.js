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
      titulo: 'Lobby',
      prefijoItems: 'crearJuegoItem',
      items: [
        'Código del lobby: -',
        'Anfitrión: -',
        'Jugadores conectados: -',
        'Estado: esperando'
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

  actualizarLobby(lobbyData) {
    if (!lobbyData) {
      this.actualizarTitulo('Lobby')
      this.actualizarItems([
        'Código del lobby: -',
        'Anfitrión: -',
        'Jugadores conectados: -',
        'Estado: esperando'
      ])
      return
    }

    const nombresJugadores = (lobbyData.players || [])
      .map((player) => player.name)
      .join(', ')

    this.actualizarTitulo(`Lobby ${lobbyData.lobbyCode}`)
    this.actualizarItems([
      `Código del lobby: ${lobbyData.lobbyCode}`,
      `Anfitrión: ${lobbyData.hostName}`,
      `Jugadores conectados: ${nombresJugadores || 'sin jugadores'}`,
      `Estado: ${lobbyData.status}`
    ])
    this.limpiarError()
  }
}
