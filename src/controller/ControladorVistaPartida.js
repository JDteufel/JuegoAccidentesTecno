import { PANTALLAS } from '../model/EstadoApp.js'

export class ControladorVistaPartida {
  constructor(vistaPartida, controladorEstadoApp) {
    this.vistaPartida = vistaPartida
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaPartida.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.GESTION_LOBBY)
    })
  }
}
