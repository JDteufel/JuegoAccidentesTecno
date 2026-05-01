import { VistaListaBase } from './base/VistaListaBase.js'

export const LOBBY_MAX_USUARIOS = 32
export const SALA_JUEGO_MAX_USUARIOS = 4

export class VistaCrearJuego extends VistaListaBase {
  constructor() {
    super()
    this.onEntrarCallback = null
  }

  obtenerConfiguracionLista() {
    return {
      nombreOverlay: 'pantallaCrearJuego',
      nombreTarjeta: 'tarjetaCrearJuego',
      nombreTitulo: 'tituloCrearJuego',
      titulo: 'Esperando Jugadores',
      prefijoItems: 'crearJuegoItem',
      items: [
        'Código del lobby: -',
        `Anfitrión: -`,
        `Jugadores: 0/${LOBBY_MAX_USUARIOS}`,
        'Estado: Esperando...'
      ],
      nombreBotonVolver: 'crearJuegoVolver'
    }
  }

  crear() {
    super.crear()

    const infoPanel = this._crearItemInfo({
      nombre: 'infoCompartir',
      texto: '💡 Espera a que el anfitrión inicie la partida',
      alterno: true
    })
    infoPanel.style.marginTop = '15px'
    this.tarjetaEl.appendChild(infoPanel)
  }

  onEntrar(callback) {
    this.onEntrarCallback = callback
  }

  actualizarLobby(lobbyData) {
    if (!lobbyData) {
      this.actualizarTitulo('Esperando Jugadores')
      this.actualizarItems([
        'Código del lobby: -',
        'Anfitrión: -',
        `Jugadores: 0/${LOBBY_MAX_USUARIOS}`,
        'Estado: Desconectado'
      ])
      return
    }

    const roomName = lobbyData.lobbyCode || ''
    const esSubSala = roomName.startsWith('Sala_')
    const playerCount = lobbyData.playerCount || 0
    const maxPlayers = esSubSala ? SALA_JUEGO_MAX_USUARIOS : LOBBY_MAX_USUARIOS
    const nombresJugadores = (lobbyData.players || [])
      .map((player) => player.name)
      .join(', ')

    console.log('[VistaCrearJuego] actualizarLobby - esSubSala:', esSubSala, 'roomName:', roomName)
    console.log('[VistaCrearJuego] playerCount:', playerCount, 'nombresJugadores:', nombresJugadores)

    if (esSubSala) {
      const partes = roomName.split('_')
      const numeroSala = partes.length >= 3 ? partes[2] : '?'
      this.actualizarTitulo(`Sala${numeroSala} (${playerCount}/${maxPlayers})`)
      this.actualizarItems([
        `🏠 Sala${numeroSala} asignada`,
        `👥 Jugadores (${playerCount}/${maxPlayers}): ${nombresJugadores || 'Sin jugadores aún'}`,
        `⏳ Estado: ${lobbyData.status === 'waiting' ? 'Esperando inicio...' : lobbyData.status}`,
        `💡 Espera a que el anfitrión inicie la partida`
      ])
    } else {
      this.actualizarTitulo(`Lobby ${lobbyData.lobbyCode} (${playerCount}/${maxPlayers})`)
      this.actualizarItems([
        `🔑 Código: ${lobbyData.lobbyCode}`,
        `👤 Anfitrión: ${lobbyData.hostName}`,
        `👥 Jugadores (${playerCount}/${maxPlayers}): ${nombresJugadores || 'Sin jugadores aún'}`,
        `⏳ Estado: ${lobbyData.status === 'waiting' ? 'Esperando más jugadores...' : lobbyData.status}`
      ])
    }

    this.limpiarError()
  }
}
