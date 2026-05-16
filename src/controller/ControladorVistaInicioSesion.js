import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import usuariosService from '../services/UsuariosService.js'
import temaService from '../services/TemaService.js'

export class ControladorVistaInicioSesion {
  constructor(vistaInicioSesion, estadoApp, controladorEstadoApp) {
    this.vistaInicioSesion = vistaInicioSesion
    this.estadoApp = estadoApp
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaInicioSesion.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_PUBLICA)
    })

    this.vistaInicioSesion.onAccion(async () => {
      const username = this.vistaInicioSesion.getValorCampo('inicioSesionUsuario')
      const password = this.vistaInicioSesion.getValorCampo('inicioSesionContrasena')

      if (!username || !password) {
        this.vistaInicioSesion.mostrarError('Por favor complete todos los campos')
        return
      }

      try {
        this.vistaInicioSesion.mostrarCargando(true)
        const result = await usuariosService.login(username, password)

        if (result.ok) {
          this.estadoApp.setUsuario(result.user.username)
          this.estadoApp.setTipoJugador(TIPOS_JUGADOR.GAMEMASTER)
          await temaService.cargarTemaInicial(result.user.username)
          this.controladorEstadoApp.aplicarTemaActual()
          this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_GAMEMASTER)
        } else {
          this.vistaInicioSesion.limpiarCampos()
          this.vistaInicioSesion.mostrarError(result.message)
        }
      } catch (error) {
        this.vistaInicioSesion.limpiarCampos()
        this.vistaInicioSesion.mostrarError(error.message)
      } finally {
        this.vistaInicioSesion.mostrarCargando(false)
      }
    })
  }
}
