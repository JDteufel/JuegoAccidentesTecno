import { VistaFormularioBase } from './base/VistaFormularioBase.js'

export class VistaJugar extends VistaFormularioBase {
  obtenerConfiguracionFormulario() {
    return {
      nombreOverlay: 'pantallaJugar',
      nombreTarjeta: 'tarjetaJugar',
      nombreTitulo: 'tituloJugar',
      titulo: 'Jugar',
      campos: [
        {
          nombre: 'jugarCodigo',
          placeholder: 'Codigo del lobby',
          top: '-70px'
        },
        {
          nombre: 'jugarNombre',
          placeholder: 'Nombre temporal',
          top: '8px'
        }
      ],
      nombreBotonAccion: 'jugarAccion',
      textoBotonAccion: 'Entrar al lobby',
      nombreBotonVolver: 'jugarVolver'
    }
  }
}
