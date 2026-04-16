import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import { loginUser } from '../services/SmartFoxService.js'

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
        const result = await loginUser(username, password)

        // Guardar usuario en estado local usando la clase Usuario
        this.estadoApp.setUsuario(result.username)
        this.estadoApp.setTipoJugador(TIPOS_JUGADOR.REGISTRADO)

        this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_REGISTRADO)
      } catch (error) {
        this.vistaInicioSesion.mostrarError(error.message)
      } finally {
        this.vistaInicioSesion.mostrarCargando(false)
      }
    })
  }
}
