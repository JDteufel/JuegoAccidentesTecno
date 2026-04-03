import { VistaFormularioBase } from './base/VistaFormularioBase.js'

export class VistaInicioSesion extends VistaFormularioBase {
  obtenerConfiguracionFormulario() {
    return {
      nombreOverlay: 'pantallaInicioSesion',
      nombreTarjeta: 'tarjetaInicioSesion',
      nombreTitulo: 'tituloInicioSesion',
      titulo: 'Inicio de Sesion',
      campos: [
        {
          nombre: 'inicioSesionUsuario',
          placeholder: 'Nombre de usuario',
          top: '-70px'
        },
        {
          nombre: 'inicioSesionContrasena',
          placeholder: 'Contrasena',
          top: '8px'
        }
      ],
      nombreBotonAccion: 'inicioSesionAccion',
      textoBotonAccion: 'Ingresar',
      nombreBotonVolver: 'inicioSesionVolver'
    }
  }
}
