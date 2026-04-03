import { VistaListaBase } from './base/VistaListaBase.js'

export class VistaCrearJuego extends VistaListaBase {
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
}
