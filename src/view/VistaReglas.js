import { VistaListaBase } from './base/VistaListaBase.js'

export class VistaReglas extends VistaListaBase {
  obtenerConfiguracionLista() {
    return {
      nombreOverlay: 'pantallaReglas',
      nombreTarjeta: 'tarjetaReglas',
      nombreTitulo: 'tituloReglas',
      titulo: 'Reglas del Juego',
      prefijoItems: 'regla',
      items: [
        'Cada jugador recibe un perfil y cartas iniciales.',
        'Las cartas completan horas o actividades validas para cada perfil.',
        'Los accidentes tecnologicos pueden debilitar o inhabilitar cartas.',
        'La partida termina cuando todos los perfiles se completan.'
      ],
      nombreBotonVolver: 'reglasVolver'
    }
  }
}
