import { PANTALLAS, TIPOS_JUGADOR } from '../model/EstadoApp.js'
import { registerUser } from '../services/SmartFoxService.js'

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
        const result = await registerUser(username, password)

        // Guardar usuario en estado local usando la clase Usuario
        this.estadoApp.setUsuario(result.username)
        this.estadoApp.setTipoJugador(TIPOS_JUGADOR.REGISTRADO)

        this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_REGISTRADO)
      } catch (error) {
        this.vistaRegistro.mostrarError(error.message)
      } finally {
        this.vistaRegistro.mostrarCargando(false)
      }
    })
  }
}
