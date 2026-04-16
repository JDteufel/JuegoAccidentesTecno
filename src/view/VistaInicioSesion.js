import { VistaFormularioBase } from './base/VistaFormularioBase.js'

export class VistaInicioSesion extends VistaFormularioBase {
  obtenerConfiguracionFormulario() {
    return {
      nombreOverlay: 'pantallaInicioSesion',
      nombreTarjeta: 'tarjetaInicioSesion',
      nombreTitulo: 'tituloInicioSesion',
      titulo: 'Inicio de Sesión',
      campos: [
        {
          nombre: 'inicioSesionUsuario',
          placeholder: 'Nombre de usuario',
          top: '-70px'
        },
        {
          nombre: 'inicioSesionContrasena',
          placeholder: 'Contraseña',
          top: '8px'
        }
      ],
      nombreBotonAccion: 'inicioSesionAccion',
      textoBotonAccion: 'Iniciar Sesión',
      nombreBotonVolver: 'inicioSesionVolver'
    }
  }
}
