export class ControladorVistaReglas {
  constructor(vistaReglas, controladorEstadoApp) {
    this.vistaReglas = vistaReglas
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaReglas.onVolver(() => {
      this.controladorEstadoApp.regresarPantallaAnterior()
    })
  }
}
