import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import usuariosService from '../services/UsuariosService.js'

export class ControladorVistaRegistro {
  constructor(vistaRegistro, estadoApp, controladorEstadoApp) {
    this.vistaRegistro = vistaRegistro
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaRegistro.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_PUBLICA)
    })

    this.vistaRegistro.onAccion(async () => {
      const username = this.vistaRegistro.getValorCampo('registroUsuario')
      const password = this.vistaRegistro.getValorCampo('registroContrasena')

      if (!username || !password) {
        this.vistaRegistro.mostrarError('Por favor complete todos los campos')
        return
      }

      try {
        this.vistaRegistro.mostrarCargando(true)
        const result = await usuariosService.registrar(username, password)

        if (result.ok) {
          this.estadoApp.setUsuario(result.user.username)
          this.estadoApp.setTipoJugador(TIPOS_JUGADOR.GAMEMASTER)
          this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_GAMEMASTER)
        } else {
          this.vistaRegistro.limpiarCampos()
          this.vistaRegistro.mostrarError(result.message)
        }
      } catch (error) {
        this.vistaRegistro.limpiarCampos()
        this.vistaRegistro.mostrarError(error.message)
      } finally {
        this.vistaRegistro.mostrarCargando(false)
      }
    })
  }
}
