import { VistaFormularioBase } from './base/VistaFormularioBase.js'

export class VistaRegistro extends VistaFormularioBase {
  obtenerConfiguracionFormulario() {
    return {
      nombreOverlay: 'pantallaRegistro',
      nombreTarjeta: 'tarjetaRegistro',
      nombreTitulo: 'tituloRegistro',
      titulo: 'Registro de Usuario',
      campos: [
        {
          nombre: 'registroUsuario',
          placeholder: 'Nombre de usuario',
          top: '-70px'
        },
        {
          nombre: 'registroContrasena',
          placeholder: 'Contraseña',
          top: '8px'
        }
      ],
      nombreBotonAccion: 'registroAccion',
      textoBotonAccion: 'Crear Cuenta',
      nombreBotonVolver: 'registroVolver'
    }
  }
}
